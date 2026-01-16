# backend/app/services/carbon_calc.py

def calculate_co2(category: str) -> float:
    """
    Returns estimated CO2 emission (in kg) for a given category.
    """

    carbon_values = {
        "Meat": 6.0,
        "Dairy": 3.2,
        "Vegetables": 1.5,
        "Fruits": 1.2,
        "Grains": 1.8,
        "Plastic": 5.5,
        "Other": 2.0
    }

    return carbon_values.get(category, 2.0)
