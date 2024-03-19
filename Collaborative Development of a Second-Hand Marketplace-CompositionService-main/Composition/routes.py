# import asyncio
# import os
# import httpx
# from fastapi import APIRouter, HTTPException, Request
# import logging
# from datetime import datetime
# from dotenv import load_dotenv
#
# # Load environment variables
# load_dotenv()
#
# logger = logging.getLogger("uvicorn")
# router = APIRouter()
#
# # Environment variables
# item_service_url = os.environ.get('ITEM_SERVICE_URL')
# review_service_url = os.environ.get('REVIEW_SERVICE_URL')
# user_service_url = os.environ.get('USER_SERVICE_URL')
# # bearer_token = os.environ.get('BEARER_TOKEN')  # Bearer token for user data
# bearer_token = request.headers.get('Authorization').split()[1]
#
# # Asynchronous function to fetch data
# async def fetch_data(url: str, item_id: str, call_type: str):
#     async with httpx.AsyncClient() as client:
#         try:
#             start_time = datetime.now()
#             response = await client.get(url)
#             response.raise_for_status()
#             end_time = datetime.now()
#             duration = (end_time - start_time).total_seconds()
#             logger.info(f"{call_type} call to {url} for item {item_id} completed in {duration} seconds.")
#             return response.json()
#         except httpx.HTTPStatusError as e:
#             logger.error(f"Error response {e.response.status_code} while making {call_type} call to {url}: {e}")
#             raise HTTPException(status_code=e.response.status_code, detail=str(e))
#
# # Fetch the first review and return review along with user ID
# async def fetch_first_review(item_id: str):
#     reviews_url = f"{review_service_url}/{item_id}/reviews/1"
#     reviews_data = await fetch_data(reviews_url, item_id, "Asynchronous")
#     review = reviews_data.get('Reviews', [])[0] if reviews_data.get('Reviews') else None
#     review_user_id = review.get('user_id') if review else None
#     return review, review_user_id
#
# # Fetch user data with authorization and track completion time
# async def fetch_user_data(user_id: str, user_type: str):
#     if user_id and bearer_token:
#         headers = {"Authorization": f"Bearer {bearer_token}"}
#         user_url = f"{user_service_url}/users/profile/{user_id}"
#         async with httpx.AsyncClient() as client:
#             try:
#                 start_time = datetime.now()
#                 response = await client.get(user_url, headers=headers)
#                 response.raise_for_status()
#                 end_time = datetime.now()
#                 duration = (end_time - start_time).total_seconds()
#                 logger.info(f"User data call for {user_type} user ID {user_id} completed in {duration} seconds.")
#                 return response.json()
#             except httpx.HTTPStatusError as e:
#                 logger.error(f"Error fetching user data for {user_type} user ID {user_id}: {e}")
#                 return None  # Return None if there's an error
#     return None
#
# # Synchronous route to get item, review, and user details
# @router.get("/item/{item_id}/details/sync")
# async def get_item_details_sync(item_id: str):
#     try:
#         item_data = await fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Synchronous")
#         review_data, review_user_id = await fetch_first_review(item_id)
#         item_user_data = await fetch_user_data(item_data.get('user_id'), "item") if item_data.get('user_id') else None
#         review_user_data = await fetch_user_data(review_user_id, "review") if review_user_id else None
#         return {
#             "item": item_data,
#             "item_user": item_user_data,
#             "review": review_data,
#             "review_user": review_user_data
#         }
#     except Exception as e:
#         logger.error(f"Synchronous call for item {item_id} failed: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
#
# # Asynchronous route to get item, review, and user details
# @router.get("/item/{item_id}/details/async")
# async def get_item_details_async(item_id: str):
#     try:
#         item_future = fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Asynchronous")
#         review_future = fetch_first_review(item_id)
#         item_data, (review_data, review_user_id) = await asyncio.gather(item_future, review_future)
#         item_user_data = await fetch_user_data(item_data.get('user_id'), "item") if item_data.get('user_id') else None
#         review_user_data = await fetch_user_data(review_user_id, "review") if review_user_id else None
#         return {
#             "item": item_data,
#             "item_user": item_user_data,
#             "review": review_data,
#             "review_user": review_user_data
#         }
#     except Exception as e:
#         logger.error(f"Asynchronous call for item {item_id} failed: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
from fastapi import FastAPI, APIRouter, HTTPException, Request
import httpx
from datetime import datetime
import logging
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("uvicorn")
app = FastAPI()
router = APIRouter()

item_service_url = os.getenv('ITEM_SERVICE_URL')
review_service_url = os.getenv('REVIEW_SERVICE_URL')
user_service_url = os.getenv('USER_SERVICE_URL')

async def fetch_data(url: str, item_id: str, call_type: str):
    async with httpx.AsyncClient() as client:
        try:
            start_time = datetime.now()
            response = await client.get(url)
            response.raise_for_status()
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            logger.info(f"{call_type} call to {url} for item {item_id} completed in {duration} seconds.")
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Error response {e.response.status_code} while making {call_type} call to {url}: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

# async def fetch_first_review(item_id: str):
#     reviews_url = f"{review_service_url}/{item_id}/reviews/1"
#     reviews_data = await fetch_data(reviews_url, item_id, "Asynchronous")
#     review = reviews_data.get('Reviews', [])[0] if reviews_data.get('Reviews') else None
#     review_user_id = review.get('user_id') if review else None
#     return review, review_user_id

# async def fetch_all_reviews(item_id: str):
#     reviews_url = f"{review_service_url}/{item_id}/reviews/1"  # Adjusted to fetch all reviews
#     reviews_data = await fetch_data(reviews_url, item_id, "Asynchronous")
#     reviews = reviews_data.get('Reviews', []) if reviews_data.get('Reviews') else []
#     return reviews
async def fetch_all_reviews(item_id: str):
    all_reviews = []
    page = 1
    while True:
        reviews_url = f"{review_service_url}/{item_id}/reviews/{page}"
        reviews_data = await fetch_data(reviews_url, item_id, "Asynchronous")
        reviews = reviews_data.get('Reviews', [])
        if not reviews:
            break  # If no reviews are returned, we have reached the end of the pages
        all_reviews.extend(reviews)
        page += 1  # Increment the page number to fetch the next set of reviews
    return all_reviews

async def fetch_user_data(user_id: str, user_type: str, token: str):
    if user_id:
        headers = {"Authorization": f"Bearer {token}"}
        user_url = f"{user_service_url}/users/profile/{user_id}"
        async with httpx.AsyncClient() as client:
            try:
                start_time = datetime.now()
                response = await client.get(user_url, headers=headers)
                response.raise_for_status()
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()
                logger.info(f"User data call for {user_type} user ID {user_id} completed in {duration} seconds.")
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Error fetching user data for {user_type} user ID {user_id}: {e}")
                return None  # Return None if there's an error
    return None

# Synchronous route to get item, review, and user details
# @router.get("/item/{item_id}/details/sync")
# async def get_item_details_sync(item_id: str, request: Request):
#     auth_header = request.headers.get('Authorization')
#     logger.info(f"Header: {auth_header}")
#     token = auth_header.split()[1]
#     logger.info(f"Token: {token}")
#
#     if not token:
#         raise HTTPException(status_code=401, detail="Unauthorized user")
#
#     item_data = await fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Synchronous")
#     review_data, review_user_id = await fetch_first_review(item_id)
#
#     item_user_data = await fetch_user_data(item_data.get('user_id'), "item", token) if item_data.get('user_id') else None
#     review_user_data = await fetch_user_data(review_user_id, "review", token) if review_user_id else None
#
#     return {
#         "item": item_data,
#         "item_user": item_user_data,
#         "review": review_data,
#         "review_user": review_user_data
#     }

# Asynchronous route to get item, review, and user details
# @router.get("/item/{item_id}/details/async")
# async def get_item_details_async(item_id: str, request: Request):
#     auth_header = request.headers.get('Authorization')
#     logger.info(f"Header: {auth_header}")
#     token = auth_header.split()[1]
#     logger.info(f"Token: {token}")
#
#     if not token:
#         raise HTTPException(status_code=401, detail="Unauthorized user")
#
#     item_future = fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Asynchronous")
#     review_future = fetch_first_review(item_id)
#
#     item_data, (review_data, review_user_id) = await asyncio.gather(item_future, review_future)
#
#     item_user_data = await fetch_user_data(item_data.get('user_id'), "item", token) if item_data.get('user_id') else None
#     review_user_data = await fetch_user_data(review_user_id, "review", token) if review_user_id else None
#
#     return {
#         "item": item_data,
#         "item_user": item_user_data,
#         "review": review_data,
#         "review_user": review_user_data
#     }
@router.get("/item/{item_id}/details/sync")
async def get_item_details_sync(item_id: str, request: Request):
    auth_header = request.headers.get('Authorization')
    logger.info(f"Header: {auth_header}")
    token = auth_header.split()[1]
    logger.info(f"Token: {token}")

    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized user")

    item_data = await fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Synchronous")
    reviews = await fetch_all_reviews(item_id)

    item_user_data = await fetch_user_data(item_data.get('user_id'), "item", token) if item_data.get('user_id') else None

    return {
        "item": item_data,
        "item_user": item_user_data,
        "reviews": reviews
    }

@router.get("/item/{item_id}/details/async")
async def get_item_details_async(item_id: str, request: Request):
    auth_header = request.headers.get('Authorization')
    logger.info(f"Header: {auth_header}")
    token = auth_header.split()[1]
    logger.info(f"Token: {token}")

    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized user")

    item_future = fetch_data(f"{item_service_url}/items/{item_id}", item_id, "Asynchronous")
    review_future = fetch_all_reviews(item_id)

    item_data, reviews = await asyncio.gather(item_future, review_future)

    item_user_data = await fetch_user_data(item_data.get('user_id'), "item", token) if item_data.get('user_id') else None

    return {
        "item": item_data,
        "item_user": item_user_data,
        "reviews": reviews
    }
app.include_router(router)
