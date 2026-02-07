import redis.asyncio as aioredis
from typing import Optional
from app.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    """Redis cache manager"""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = await aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            # Test connection
            await self.redis.ping()
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Could not connect to Redis: {e}")
            raise
    
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
            logger.info("Closed Redis connection")
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error(f"Redis GET error: {e}")
            return None
    
    async def set(
        self, 
        key: str, 
        value: str, 
        expire: int = None
    ) -> bool:
        """Set value in cache with optional expiration"""
        try:
            if expire:
                return await self.redis.setex(key, expire, value)
            return await self.redis.set(key, value)
        except Exception as e:
            logger.error(f"Redis SET error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            return await self.redis.delete(key) > 0
        except Exception as e:
            logger.error(f"Redis DELETE error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return await self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis EXISTS error: {e}")
            return False
    
    async def set_json(
        self, 
        key: str, 
        value: dict, 
        expire: int = None
    ) -> bool:
        """Set JSON value"""
        return await self.set(key, json.dumps(value), expire)
    
    async def get_json(self, key: str) -> Optional[dict]:
        """Get JSON value"""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None

# Global cache instance
cache = RedisCache()
