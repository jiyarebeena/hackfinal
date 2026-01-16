def categorize_item(line: str) -> str:
    categories = {
        "Dairy": ["milk", "cheese", "butter", "yogurt"],
        "Meat": ["chicken", "beef", "mutton", "pork", "fish"],
        "Vegetables": ["tomato", "onion", "potato", "carrot"],
        "Fruits": ["apple", "banana", "orange", "mango"],
        "Plastic": ["plastic", "bag", "bottle", "wrapper"],
        "Grains": ["rice", "bread", "pasta", "wheat"]
    }

    line = line.lower()

    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in line:
                return category

    return "Other"