import asyncio
import json
import os
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.core.database import connect_to_mongo, db
from app.models.role import Role, Skill
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def load_json_file(filename: str) -> list:
    """Load JSON data from file"""
    file_path = Path(__file__).parent.parent / "data" / filename
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    return data

async def seed_skills():
    """Seed skills collection"""
    logger.info("Seeding skills...")
    
    skills_data = await load_json_file("skills_seed.json")
    
    # Check if skills already exist
    existing_count = await Skill.count()
    if existing_count > 0:
        logger.warning(f"Skills already exist ({existing_count} found). Skipping...")
        return
    
    # Insert skills
    inserted = 0
    for skill_data in skills_data:
        try:
            skill = Skill(**skill_data)
            await skill.insert()
            inserted += 1
            logger.info(f"  Added skill: {skill.skill_name}")
        except Exception as e:
            logger.error(f"  Failed to add skill {skill_data.get('skill_name')}: {e}")
    
    logger.info(f"Successfully seeded {inserted} skills")

async def seed_roles():
    """Seed roles collection"""
    logger.info("Seeding roles...")
    
    roles_data = await load_json_file("roles_seed.json")
    
    # Check if roles already exist
    existing_count = await Role.count()
    if existing_count > 0:
        logger.warning(f"Roles already exist ({existing_count} found). Skipping...")
        return
    
    # Insert roles
    inserted = 0
    for role_data in roles_data:
        try:
            role = Role(**role_data)
            await role.insert()
            inserted += 1
            logger.info(f"  Added role: {role.role_name}")
        except Exception as e:
            logger.error(f"  Failed to add role {role_data.get('role_name')}: {e}")
    
    logger.info(f"Successfully seeded {inserted} roles")

async def verify_data():
    """Verify seeded data"""
    logger.info("Verifying seeded data...")
    
    skills_count = await Skill.count()
    roles_count = await Role.count()
    
    logger.info(f"  Total skills: {skills_count}")
    logger.info(f"  Total roles: {roles_count}")
    
    # Sample verification
    sample_role = await Role.find_one()
    if sample_role:
        logger.info(f"  Sample role: {sample_role.role_name} with {len(sample_role.required_skills)} required skills")

async def main():
    """Main seeding function"""
    logger.info("=" * 60)
    logger.info("Starting Database Seeding")
    logger.info("=" * 60)
    
    try:
        # Connect to database
        await connect_to_mongo()
        
        # Seed in order (skills first, then roles)
        await seed_skills()
        await seed_roles()
        
        # Verify
        await verify_data()
        
        logger.info("=" * 60)
        logger.info("Database seeding completed successfully!")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Seeding failed: {e}", exc_info=True)
        raise
    
    finally:
        # Close connection
        if db.client:
            db.client.close()

if __name__ == "__main__":
    asyncio.run(main())
