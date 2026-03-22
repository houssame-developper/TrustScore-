from pydantic import BaseModel,ConfigDict,Field

class RatingCreate(BaseModel):
    rate: float = Field(ge=0.0,le=5.0)
    private_key: str
    model_config = ConfigDict(extra="forbid")

 