from fastapi import FastAPI
from dotenv import load_dotenv
from Composition.routes import router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # Load environment variables from .env file at the start
app = FastAPI()


# Set up CORS middleware options
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Include the router from routes.py in the Composition package
app.include_router(router)
