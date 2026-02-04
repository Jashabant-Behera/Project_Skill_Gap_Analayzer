import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("api")

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all API requests and responses"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            
            # Log response
            process_time = time.time() - start_time
            logger.info(
                f"Response: {response.status_code} | "
                f"Time: {process_time:.2f}s | "
                f"Path: {request.url.path}"
            )
            
            response.headers["X-Process-Time"] = str(process_time)
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Error: {str(e)} | "
                f"Time: {process_time:.2f}s | "
                f"Path: {request.url.path}",
                exc_info=True
            )
            raise
