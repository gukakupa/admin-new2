import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Testimonials seed data
testimonials_data = [
    {
        "id": "testimonial_1",
        "name": "ნინო ღაღანიძე",
        "name_en": "Nino Ghaganidze",
        "position": "ბიზნეს ანალიტიკოსი",
        "position_en": "Business Analyst",
        "text_ka": "DataLab Georgia-მ ჩემი კომპანიის მნიშვნელოვანი მონაცემები აღადგინა დაზიანებული SSD-დან. შედეგი შესანიშნავი იყო!",
        "text_en": "DataLab Georgia recovered my company's important data from a damaged SSD. The result was excellent!",
        "rating": 5,
        "image": "https://images.unsplash.com/photo-1494790108755-2616b612b754?w=150&h=150&fit=crop&crop=face",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "testimonial_2",
        "name": "გიორგი კვარაცხელია",
        "name_en": "Giorgi Kvaratskhelia", 
        "position": "IT მენეჯერი",
        "position_en": "IT Manager",
        "text_ka": "პროფესიონალური მიდგომა და სწრაფი მომსახურება. RAID მასივიდან 100% მონაცემები აღადგინეს.",
        "text_en": "Professional approach and fast service. They recovered 100% of data from our RAID array.",
        "rating": 5,
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": "testimonial_3",
        "name": "ელენე მამუკელაშვილი",
        "name_en": "Elene Mamukelashvili",
        "position": "ფოტოგრაფი",
        "position_en": "Photographer",
        "text_ka": "დაზიანებული SD ბარათიდან ყველა ფოტო აღადგინეს. ძალიან კმაყოფილი ვარ სერვისით!",
        "text_en": "They recovered all photos from my damaged SD card. Very satisfied with the service!",
        "rating": 5,
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
]

async def seed_testimonials():
    """Seed testimonials data into database"""
    try:
        # Connect to database
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        # Check if testimonials already exist
        existing_count = await db.testimonials.count_documents({})
        
        if existing_count == 0:
            # Insert testimonials data
            result = await db.testimonials.insert_many(testimonials_data)
            print(f"✅ Inserted {len(result.inserted_ids)} testimonials")
        else:
            print(f"ℹ️  Testimonials already exist ({existing_count} records)")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error seeding testimonials: {str(e)}")

async def seed_case_counter():
    """Initialize case counter for the current year"""
    try:
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        current_year = datetime.now().year
        
        # Check if counter exists for current year
        existing_counter = await db.case_counters.find_one({"year": current_year})
        
        if not existing_counter:
            # Initialize counter
            await db.case_counters.insert_one({
                "year": current_year,
                "sequence": 0
            })
            print(f"✅ Initialized case counter for year {current_year}")
        else:
            print(f"ℹ️  Case counter already exists for {current_year} (sequence: {existing_counter['sequence']})")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error initializing case counter: {str(e)}")

async def main():
    """Run all seed operations"""
    print("🌱 Seeding database...")
    await seed_testimonials()
    await seed_case_counter()
    print("✅ Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(main())