from pydantic import BaseModel


class SummaryResponse(BaseModel):
    total_assets: float  # 총 자산
    total_liabilities: float  # 총 부채
    net_worth: float  # 순자산


class MonthlyResponse(BaseModel):
    total_income: float  # 이번 달 수입 합계
    total_expense: float  # 이번 달 지출 합계
    month: int  # 월 (1-12)
    year: int  # 연도
