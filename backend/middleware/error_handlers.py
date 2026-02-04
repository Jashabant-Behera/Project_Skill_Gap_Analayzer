import os
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from bson.errors import InvalidId

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with standardized response"""
    # Convert errors to serializable format
    errors = []
    for error in exc.errors():
        error_dict = {
            "loc": list(error.get("loc", [])),
            "msg": error.get("msg", ""),
            "type": error.get("type", "")
        }
        # Only include input if it's not bytes
        if "input" in error and not isinstance(error["input"], bytes):
            error_dict["input"] = error["input"]
        errors.append(error_dict)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Validation error",
            "detail": errors,
            "code": "VALIDATION_ERROR"
        }
    )

async def mongodb_exception_handler(request: Request, exc: InvalidId):
    """Handle MongoDB InvalidId errors"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "status": "error",
            "message": "Invalid ID format",
            "detail": str(exc),
            "code": "INVALID_ID"
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An internal server error occurred",
            "detail": str(exc) if os.getenv("DEBUG") == "True" else "Check server logs",
            "code": "INTERNAL_ERROR"
        }
    )
