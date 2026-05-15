"""ASGI adapter for AWS Lambda + API Gateway HTTP API (Mangum)."""

from mangum import Mangum

from main import app

handler = Mangum(app, lifespan="off")
