export const GU_TILES = [
  { guCode: '11380', guName: '은평구' },
  { guCode: '11320', guName: '도봉구' },
  { guCode: '11305', guName: '강북구' },
  { guCode: '11350', guName: '노원구' },
  { guCode: '11260', guName: '중랑구' },
  // 2행
  { guCode: '11110', guName: '종로구' },
  { guCode: '11290', guName: '성북구' },
  { guCode: '11230', guName: '동대문구' },
  { guCode: '11200', guName: '성동구' },
  { guCode: '11215', guName: '광진구' },
  // 3행
  { guCode: '11440', guName: '마포구' },
  { guCode: '11140', guName: '중구' },
  { guCode: '11170', guName: '용산구' },
  { guCode: '11740', guName: '강동구' },
  { guCode: '11710', guName: '송파구' },
  // 4행
  { guCode: '11410', guName: '서대문구' },
  { guCode: '11560', guName: '영등포구' },
  { guCode: '11590', guName: '동작구' },
  { guCode: '11650', guName: '서초구' },
  { guCode: '11680', guName: '강남구' },
  // 5행
  { guCode: '11500', guName: '강서구' },
  { guCode: '11470', guName: '양천구' },
  { guCode: '11530', guName: '구로구' },
  { guCode: '11545', guName: '금천구' },
  { guCode: '11620', guName: '관악구' },
] as const;

export const GU_NAME_BY_CODE = new Map<string, string>(GU_TILES.map((g) => [g.guCode, g.guName]));