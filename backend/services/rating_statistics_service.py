from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException,status
from sqlalchemy import select,func,Cast,FLOAT
from models.ratings import Rating


class RatingStatisticsService:

    async def rating_statis(self,prof_id:UUID,session:AsyncSession): 
      try:
        # اطلب الحسابات مباشرة من قاعدة البيانات
        stmt = select(
            func.count(Rating.id).label("number_voters"),
            func.max(Rating.rate).label("max_score"),
            func.min(Rating.rate).label("min_score"),
            Cast(func.sum(Rating.rate), FLOAT).label("sum_score"),
            Cast(func.avg(Rating.rate), FLOAT).label("avg_score")
        ).where(Rating.prof_id == prof_id)

        result = await session.execute(stmt)
        stats = result.first()

        if stats.count == 0:
            raise HTTPException(status_code=404, detail="No ratings found")

        return {
            "number_voters": stats.number_voters,
            "max_score": stats.max_score,
            "sum_score": stats.sum_score,
            "min_score": stats.min_score,
            "avg_score": float(stats.avg_score)
        }


      except HTTPException as e:
        raise e
      except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Database error: {str(e)}")



