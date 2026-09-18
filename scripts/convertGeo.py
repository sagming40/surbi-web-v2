"""
서울 열린데이터광장 상권분석서비스 영역 SHP → GeoJSON(WGS84) 변환.

  입력  EPSG:5181 (Korea 2000 / Central Belt), 미터 단위
  출력  EPSG:4326 (WGS84), [경도, 위도]

핵심: 행정동 425개만 읽어서 단순화하고, 자치구와 서울 외곽선은 그것을 합쳐서 만든다.

  왜 그러냐면 —
  폴리곤을 따로따로 단순화하면 이웃끼리 공유하는 경계가 서로 다르게 깎여
  지도에서 선이 두 줄로 벌어진다. topojson 은 공유 경계를 하나의 arc 로 뽑아
  한 번만 단순화하므로 어긋나지 않는다.
  자치구·서울 파일을 따로 변환하지 않고 행정동을 합쳐서 만드는 것도 같은 이유다.
"""
import json, sys, collections
import shapefile
from pyproj import Transformer
from shapely.geometry import Polygon, shape, mapping
from shapely.ops import unary_union
import topojson as tp

TF = Transformer.from_crs("EPSG:5181", "EPSG:4326", always_xy=True)
TOLERANCE_M = 15  # 단순화 허용오차(미터). 투영좌표에서 줄여야 남북이 안 찌그러진다

def rings_to_geom(sh):
    parts = list(sh.parts) + [len(sh.points)]
    rings = [sh.points[parts[i]:parts[i+1]] for i in range(len(parts) - 1)]
    polys = [Polygon(r) for r in rings if len(r) >= 4]
    polys = [p if p.is_valid else p.buffer(0) for p in polys]
    return unary_union(polys)

def to_wgs(geom, nd=5):
    def conv(coords):
        return [[round(v, nd) for v in TF.transform(x, y)] for x, y in coords]
    if geom.geom_type == "Polygon":
        return {"type": "Polygon",
                "coordinates": [conv(geom.exterior.coords)] + [conv(i.coords) for i in geom.interiors]}
    return {"type": "MultiPolygon",
            "coordinates": [[conv(p.exterior.coords)] + [conv(i.coords) for i in p.interiors]
                            for p in geom.geoms]}

# ── 행정동 읽기 ──
r = shapefile.Reader("dong/data", encoding="utf-8")
fields = [f[0] for f in r.fields[1:]]
dongs = []
for sr in r.iterShapeRecords():
    rec = dict(zip(fields, sr.record))
    dongs.append({"rec": rec, "geom": rings_to_geom(sr.shape)})
print(f"행정동 {len(dongs)}건 읽음", file=sys.stderr)

# ── 공유 경계를 한 번만 단순화 ──
topo = tp.Topology([d["geom"] for d in dongs], prequantize=False, shared_coords=True)
simplified = topo.toposimplify(TOLERANCE_M).to_geojson()
feats = json.loads(simplified)["features"]
assert len(feats) == len(dongs)
for d, f in zip(dongs, feats):
    g = shape(f["geometry"])
    d["simple"] = g if g.is_valid else g.buffer(0)

# ── 자치구 이름표 ──
rg = shapefile.Reader("gu/data", encoding="utf-8")
gf = [f[0] for f in rg.fields[1:]]
GU = {rec[0]: {"name": rec[1], "x": rec[2], "y": rec[3]}
      for rec in (dict(zip(gf, r_)) and r_ for r_ in rg.records())}
GU = {r_[gf.index("SIGNGU_CD")]: {"name": r_[gf.index("SIGNGU_NM")],
                                  "x": r_[gf.index("XCNTS_VALU")],
                                  "y": r_[gf.index("YDNTS_VALU")]}
      for r_ in rg.records()}

# ── 합쳐서 자치구 · 서울 만들기 ──
by_gu = collections.defaultdict(list)
for d in dongs:
    by_gu[d["rec"]["ADSTRD_CD"][:5]].append(d)

gu_geoms = {}
for gu, items in by_gu.items():
    merged = unary_union([i["simple"] for i in items])
    # 합칠 때 생기는 머리카락 같은 틈을 메운다 (1cm 버퍼 후 복구)
    gu_geoms[gu] = merged
seoul_geom = unary_union(list(gu_geoms.values()))

def center(x, y):
    lng, lat = TF.transform(x, y)
    return {"lat": round(lat, 6), "lng": round(lng, 6)}

out = {
    "seoul": to_wgs(seoul_geom),
    "gu": [{"guCode": g, "guName": GU[g]["name"],
            "center": center(GU[g]["x"], GU[g]["y"]),
            "geometry": to_wgs(gu_geoms[g])} for g in sorted(gu_geoms)],
    "dong": {g: [{"dongCode": i["rec"]["ADSTRD_CD"], "dongName": i["rec"]["ADSTRD_NM"],
                  "center": center(i["rec"]["XCNTS_VALU"], i["rec"]["YDNTS_VALU"]),
                  "geometry": to_wgs(i["simple"])}
                 for i in sorted(by_gu[g], key=lambda x: x["rec"]["ADSTRD_CD"])]
             for g in sorted(by_gu)},
}
json.dump(out, open("converted2.json", "w"), ensure_ascii=False)

def count(g):
    return sum(len(r) for r in g["coordinates"]) if g["type"] == "Polygon" \
        else sum(len(r) for p in g["coordinates"] for r in p)
print("서울 좌표", count(out["seoul"]), file=sys.stderr)
print("자치구 좌표", sum(count(x["geometry"]) for x in out["gu"]), file=sys.stderr)
print("행정동 좌표", sum(count(d["geometry"]) for v in out["dong"].values() for d in v), file=sys.stderr)
print("MultiPolygon:", sum(1 for x in out["gu"] if x["geometry"]["type"] == "MultiPolygon"), "구", file=sys.stderr)
