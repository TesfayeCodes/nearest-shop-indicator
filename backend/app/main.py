from fastapi import FastAPI
from app.routes.shop_routes import router

app = FastAPI(title="Nearest Shop API")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "API Running"}
