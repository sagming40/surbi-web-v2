import type { SeoulMapResponse } from '@/shared/types/map';

/**
 * 01 서울 전체 지도 탐색 mock.
 *
 * 지표 4종이 한 응답에 모두 담긴다 — 토글을 바꿔도 API 재호출이 없다는 설계를 그대로 따랐다.
 * rank 는 서버가 지표별로 매겨서 내려주는 값이라 여기서도 미리 계산해 넣어 두었다.
 *
 * 매출 수치는 목업 좌측 패널의 TOP 10 을 그대로 썼고, 나머지 15개 구는 이어서 채웠다.
 * 나머지 지표는 형태만 맞춘 임의값이다.
 */
export const seoulMapMock: SeoulMapResponse = {
  quarter: '2026Q1',
  category: { code: null, name: '전체 업종' },
  districtRanking: [
    {
      "guCode": "11680",
      "guName": "강남구",
      "storeCount": {
        "value": 28262,
        "changeRate": 0.2,
        "rank": 1
      },
      "sales": {
        "value": 124000000000,
        "changeRate": 5.2,
        "rank": 1
      },
      "flowPopulation": {
        "value": 2544480,
        "changeRate": 0.7,
        "rank": 1
      },
      "residentPopulation": {
        "value": 503082,
        "changeRate": 0.0,
        "rank": 1
      }
    },
    {
      "guCode": "11710",
      "guName": "송파구",
      "storeCount": {
        "value": 17995,
        "changeRate": 0.0,
        "rank": 4
      },
      "sales": {
        "value": 89200000000,
        "changeRate": 3.8,
        "rank": 2
      },
      "flowPopulation": {
        "value": 1542267,
        "changeRate": -0.4,
        "rank": 4
      },
      "residentPopulation": {
        "value": 195282,
        "changeRate": -0.1,
        "rank": 24
      }
    },
    {
      "guCode": "11650",
      "guName": "서초구",
      "storeCount": {
        "value": 20607,
        "changeRate": 0.4,
        "rank": 3
      },
      "sales": {
        "value": 81100000000,
        "changeRate": 2.1,
        "rank": 3
      },
      "flowPopulation": {
        "value": 1926125,
        "changeRate": 0.7,
        "rank": 3
      },
      "residentPopulation": {
        "value": 503082,
        "changeRate": 0.0,
        "rank": 2
      }
    },
    {
      "guCode": "11440",
      "guName": "마포구",
      "storeCount": {
        "value": 21648,
        "changeRate": 0.6,
        "rank": 2
      },
      "sales": {
        "value": 76400000000,
        "changeRate": 7.4,
        "rank": 4
      },
      "flowPopulation": {
        "value": 2090304,
        "changeRate": 0.5,
        "rank": 2
      },
      "residentPopulation": {
        "value": 434682,
        "changeRate": 0.2,
        "rank": 9
      }
    },
    {
      "guCode": "11560",
      "guName": "영등포구",
      "storeCount": {
        "value": 12558,
        "changeRate": -0.1,
        "rank": 7
      },
      "sales": {
        "value": 70300000000,
        "changeRate": -1.2,
        "rank": 5
      },
      "flowPopulation": {
        "value": 1015132,
        "changeRate": 0.6,
        "rank": 9
      },
      "residentPopulation": {
        "value": 468882,
        "changeRate": -0.2,
        "rank": 4
      }
    },
    {
      "guCode": "11140",
      "guName": "중구",
      "storeCount": {
        "value": 16316,
        "changeRate": 0.3,
        "rank": 5
      },
      "sales": {
        "value": 68800000000,
        "changeRate": 4.6,
        "rank": 6
      },
      "flowPopulation": {
        "value": 1490208,
        "changeRate": 0.1,
        "rank": 6
      },
      "residentPopulation": {
        "value": 332082,
        "changeRate": 0.0,
        "rank": 21
      }
    },
    {
      "guCode": "11110",
      "guName": "종로구",
      "storeCount": {
        "value": 16116,
        "changeRate": 0.5,
        "rank": 6
      },
      "sales": {
        "value": 61200000000,
        "changeRate": -2.8,
        "rank": 7
      },
      "flowPopulation": {
        "value": 1523268,
        "changeRate": 0.1,
        "rank": 5
      },
      "residentPopulation": {
        "value": 332082,
        "changeRate": 0.1,
        "rank": 22
      }
    },
    {
      "guCode": "11200",
      "guName": "성동구",
      "storeCount": {
        "value": 10607,
        "changeRate": -0.1,
        "rank": 13
      },
      "sales": {
        "value": 57400000000,
        "changeRate": 12.4,
        "rank": 8
      },
      "flowPopulation": {
        "value": 872480,
        "changeRate": 0.2,
        "rank": 14
      },
      "residentPopulation": {
        "value": 366282,
        "changeRate": -0.1,
        "rank": 16
      }
    },
    {
      "guCode": "11170",
      "guName": "용산구",
      "storeCount": {
        "value": 10992,
        "changeRate": 0.0,
        "rank": 11
      },
      "sales": {
        "value": 52100000000,
        "changeRate": 6.1,
        "rank": 9
      },
      "flowPopulation": {
        "value": 960203,
        "changeRate": 0.1,
        "rank": 13
      },
      "residentPopulation": {
        "value": 332082,
        "changeRate": 0.0,
        "rank": 23
      }
    },
    {
      "guCode": "11215",
      "guName": "광진구",
      "storeCount": {
        "value": 12385,
        "changeRate": 0.3,
        "rank": 8
      },
      "sales": {
        "value": 49800000000,
        "changeRate": 1.9,
        "rank": 10
      },
      "flowPopulation": {
        "value": 1149632,
        "changeRate": 0.2,
        "rank": 7
      },
      "residentPopulation": {
        "value": 366282,
        "changeRate": 0.0,
        "rank": 17
      }
    },
    {
      "guCode": "11500",
      "guName": "강서구",
      "storeCount": {
        "value": 10995,
        "changeRate": 0.2,
        "rank": 10
      },
      "sales": {
        "value": 47600000000,
        "changeRate": 2.4,
        "rank": 11
      },
      "flowPopulation": {
        "value": 994840,
        "changeRate": 0.6,
        "rank": 11
      },
      "residentPopulation": {
        "value": 468882,
        "changeRate": 0.0,
        "rank": 5
      }
    },
    {
      "guCode": "11230",
      "guName": "동대문구",
      "storeCount": {
        "value": 7153,
        "changeRate": -0.3,
        "rank": 20
      },
      "sales": {
        "value": 45100000000,
        "changeRate": -0.7,
        "rank": 12
      },
      "flowPopulation": {
        "value": 539847,
        "changeRate": 0.2,
        "rank": 22
      },
      "residentPopulation": {
        "value": 366282,
        "changeRate": -0.2,
        "rank": 18
      }
    },
    {
      "guCode": "11740",
      "guName": "강동구",
      "storeCount": {
        "value": 7671,
        "changeRate": -0.2,
        "rank": 18
      },
      "sales": {
        "value": 43700000000,
        "changeRate": 3.3,
        "rank": 13
      },
      "flowPopulation": {
        "value": 614422,
        "changeRate": -0.4,
        "rank": 19
      },
      "residentPopulation": {
        "value": 195282,
        "changeRate": -0.2,
        "rank": 25
      }
    },
    {
      "guCode": "11350",
      "guName": "노원구",
      "storeCount": {
        "value": 8773,
        "changeRate": 0.0,
        "rank": 15
      },
      "sales": {
        "value": 42200000000,
        "changeRate": 1.1,
        "rank": 14
      },
      "flowPopulation": {
        "value": 761710,
        "changeRate": 0.3,
        "rank": 17
      },
      "residentPopulation": {
        "value": 400482,
        "changeRate": 0.0,
        "rank": 12
      }
    },
    {
      "guCode": "11290",
      "guName": "성북구",
      "storeCount": {
        "value": 10618,
        "changeRate": 0.4,
        "rank": 12
      },
      "sales": {
        "value": 40800000000,
        "changeRate": -1.9,
        "rank": 15
      },
      "flowPopulation": {
        "value": 1000008,
        "changeRate": 0.2,
        "rank": 10
      },
      "residentPopulation": {
        "value": 366282,
        "changeRate": 0.1,
        "rank": 19
      }
    },
    {
      "guCode": "11620",
      "guName": "관악구",
      "storeCount": {
        "value": 11071,
        "changeRate": 0.6,
        "rank": 9
      },
      "sales": {
        "value": 39500000000,
        "changeRate": 2.8,
        "rank": 16
      },
      "flowPopulation": {
        "value": 1065710,
        "changeRate": 0.7,
        "rank": 8
      },
      "residentPopulation": {
        "value": 503082,
        "changeRate": 0.1,
        "rank": 3
      }
    },
    {
      "guCode": "11380",
      "guName": "은평구",
      "storeCount": {
        "value": 6923,
        "changeRate": -0.1,
        "rank": 21
      },
      "sales": {
        "value": 38100000000,
        "changeRate": 0.6,
        "rank": 17
      },
      "flowPopulation": {
        "value": 564642,
        "changeRate": 0.3,
        "rank": 20
      },
      "residentPopulation": {
        "value": 400482,
        "changeRate": -0.1,
        "rank": 13
      }
    },
    {
      "guCode": "11410",
      "guName": "서대문구",
      "storeCount": {
        "value": 5708,
        "changeRate": -0.3,
        "rank": 23
      },
      "sales": {
        "value": 36700000000,
        "changeRate": -3.1,
        "rank": 18
      },
      "flowPopulation": {
        "value": 425353,
        "changeRate": 0.5,
        "rank": 24
      },
      "residentPopulation": {
        "value": 434682,
        "changeRate": -0.2,
        "rank": 10
      }
    },
    {
      "guCode": "11530",
      "guName": "구로구",
      "storeCount": {
        "value": 7209,
        "changeRate": 0.0,
        "rank": 19
      },
      "sales": {
        "value": 35200000000,
        "changeRate": 4.2,
        "rank": 19
      },
      "flowPopulation": {
        "value": 621984,
        "changeRate": 0.6,
        "rank": 18
      },
      "residentPopulation": {
        "value": 468882,
        "changeRate": -0.1,
        "rank": 6
      }
    },
    {
      "guCode": "11470",
      "guName": "양천구",
      "storeCount": {
        "value": 8692,
        "changeRate": 0.4,
        "rank": 16
      },
      "sales": {
        "value": 33800000000,
        "changeRate": 1.5,
        "rank": 20
      },
      "flowPopulation": {
        "value": 815594,
        "changeRate": 0.5,
        "rank": 16
      },
      "residentPopulation": {
        "value": 434682,
        "changeRate": 0.1,
        "rank": 11
      }
    },
    {
      "guCode": "11590",
      "guName": "동작구",
      "storeCount": {
        "value": 9929,
        "changeRate": 0.8,
        "rank": 14
      },
      "sales": {
        "value": 32400000000,
        "changeRate": -0.4,
        "rank": 21
      },
      "flowPopulation": {
        "value": 978803,
        "changeRate": 0.6,
        "rank": 12
      },
      "residentPopulation": {
        "value": 468882,
        "changeRate": 0.2,
        "rank": 7
      }
    },
    {
      "guCode": "11260",
      "guName": "중랑구",
      "storeCount": {
        "value": 8507,
        "changeRate": 0.7,
        "rank": 17
      },
      "sales": {
        "value": 29700000000,
        "changeRate": 2.0,
        "rank": 22
      },
      "flowPopulation": {
        "value": 823878,
        "changeRate": 0.2,
        "rank": 15
      },
      "residentPopulation": {
        "value": 366282,
        "changeRate": 0.2,
        "rank": 20
      }
    },
    {
      "guCode": "11305",
      "guName": "강북구",
      "storeCount": {
        "value": 4560,
        "changeRate": -0.2,
        "rank": 25
      },
      "sales": {
        "value": 26800000000,
        "changeRate": -2.2,
        "rank": 23
      },
      "flowPopulation": {
        "value": 358986,
        "changeRate": 0.3,
        "rank": 25
      },
      "residentPopulation": {
        "value": 400482,
        "changeRate": -0.2,
        "rank": 14
      }
    },
    {
      "guCode": "11320",
      "guName": "도봉구",
      "storeCount": {
        "value": 5641,
        "changeRate": 0.2,
        "rank": 24
      },
      "sales": {
        "value": 24100000000,
        "changeRate": 0.9,
        "rank": 24
      },
      "flowPopulation": {
        "value": 512848,
        "changeRate": 0.3,
        "rank": 23
      },
      "residentPopulation": {
        "value": 400482,
        "changeRate": 0.0,
        "rank": 15
      }
    },
    {
      "guCode": "11545",
      "guName": "금천구",
      "storeCount": {
        "value": 5750,
        "changeRate": 0.5,
        "rank": 22
      },
      "sales": {
        "value": 21400000000,
        "changeRate": 5.7,
        "rank": 25
      },
      "flowPopulation": {
        "value": 546877,
        "changeRate": 0.6,
        "rank": 21
      },
      "residentPopulation": {
        "value": 468882,
        "changeRate": 0.1,
        "rank": 8
      }
    }
  ],
};
