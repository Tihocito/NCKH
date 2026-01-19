import json
import random

# Load existing knowledge base to get current dishes
with open('data/knowledge_base.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

current_dishes = data['dishes']
max_id = max(dish['id'] for dish in current_dishes) if current_dishes else 0

# Start from 251 as requested
start_id = 251

# Define categories and their keywords for naming
categories = {
    'beverage': {
        'count': 50,
        'keywords': ['nước', 'trà', 'sinh tố', 'nước ép', 'sữa', 'nước mía', 'nước sấu', 'nước chanh', 'nước cam', 'nước bưởi', 'nước dừa', 'nước dưa hấu', 'nước mãng cầu', 'nước ổi', 'nước táo', 'nước lê', 'nước nho', 'nước vú sữa', 'nước me', 'nước chua me', 'trà gừng', 'trà atiso', 'trà xanh', 'trà ô long', 'trà sen', 'trà nhài', 'trà thảo mộc', 'trà kim ngân', 'trà cỏ ngọt', 'trà mã đề', 'sinh tố bơ', 'sinh tố mãng cầu', 'sinh tố xoài', 'sinh tố dừa', 'sinh tố sapoche', 'sinh tố mít', 'sinh tố chanh dây', 'sinh tố bưởi', 'sinh tố cam', 'sinh tố táo', 'sinh tố dâu', 'sinh tố việt quất', 'sinh tố kiwi', 'sinh tố nho', 'sinh tố lê', 'sinh tố ổi', 'sinh tố mãng cầu', 'sinh tố thanh long', 'sinh tố mướp đắng', 'sinh tố rau má']
    },
    'dessert': {
        'count': 50,
        'keywords': ['chè', 'bánh', 'kem', 'pudding', 'thạch', 'sữa chua', 'chè thập cẩm', 'chè hạt sen', 'chè hạt lựu', 'chè đậu xanh', 'chè đậu đỏ', 'chè đậu đen', 'chè khoai lang', 'chè bí đỏ', 'chè mãng cầu', 'chè sấu', 'chè me', 'chè nhãn', 'chè vú sữa', 'chè long nhãn', 'bánh flan', 'bánh mousse', 'bánh tiramisu', 'bánh cheesecake', 'bánh crepe', 'bánh pancake', 'bánh waffle', 'bánh cupcake', 'bánh brownie', 'bánh cookie', 'kem vani', 'kem socolate', 'kem dâu', 'kem bạc hà', 'kem trà xanh', 'kem matcha', 'kem xoài', 'kem dừa', 'kem việt quất', 'kem chanh', 'pudding sữa', 'pudding chocolate', 'pudding trái cây', 'thạch dừa', 'thạch rau câu', 'thạch trái cây', 'thạch phô mai', 'sữa chua uống', 'sữa chua ăn', 'sữa chua trái cây']
    },
    'sweet_dish': {
        'count': 50,
        'keywords': ['kẹo', 'mứt', 'đường phèn', 'si rô', 'honey', 'kẹo lạc', 'kẹo dừa', 'kẹo gừng', 'kẹo chanh', 'kẹo bạc hà', 'kẹo cam', 'kẹo táo', 'kẹo nho', 'kẹo việt quất', 'kẹo dâu', 'mứt bí', 'mứt gừng', 'mứt chanh', 'mứt cam', 'mứt táo', 'mứt ổi', 'mứt mãng cầu', 'mứt xoài', 'mứt dừa', 'mứt sấu', 'mứt me', 'mứt nhãn', 'mứt vú sữa', 'đường phèn gừng', 'đường phèn chanh', 'đường phèn cam', 'đường phèn táo', 'đường phèn ổi', 'đường phèn mãng cầu', 'đường phèn xoài', 'đường phèn dừa', 'đường phèn sấu', 'đường phèn me', 'đường phèn nhãn', 'đường phèn vú sữa', 'si rô gừng', 'si rô chanh', 'si rô cam', 'si rô táo', 'si rô ổi', 'si rô mãng cầu', 'si rô xoài', 'si rô dừa', 'si rô sấu', 'si rô me', 'si rô nhãn']
    },
    'side': {
        'count': 50,
        'keywords': ['salad', 'rau luộc', 'đồ chua', 'gỏi', 'món kèm', 'salad rau', 'salad trái cây', 'salad gà', 'salad cá', 'salad thịt', 'salad tôm', 'salad cua', 'rau luộc rau muống', 'rau luộc rau ngót', 'rau luộc rau dền', 'rau luộc rau má', 'rau luộc rau diếp', 'rau luộc rau thơm', 'rau luộc rau xà lách', 'rau luộc rau bina', 'rau luộc rau cải', 'rau luộc rau củ', 'đồ chua cà', 'đồ chua dưa leo', 'đồ chua cà rốt', 'đồ chua hành tây', 'đồ chua tỏi', 'đồ chua gừng', 'đồ chua ớt', 'đồ chua me', 'gỏi gà', 'gỏi cá', 'gỏi thịt', 'gỏi tôm', 'gỏi cua', 'gỏi bò', 'gỏi heo', 'gỏi rau', 'gỏi trái cây', 'món kèm rau', 'món kèm củ', 'món kèm trái cây', 'món kèm thịt', 'món kèm cá', 'món kèm gà', 'món kèm tôm', 'món kèm cua', 'món kèm trứng', 'món kèm đậu', 'món kèm hạt']
    },
    'main_savoury': {
        'count': 50,
        'keywords': ['thịt kho', 'gà xào', 'cá hấp', 'thịt kho tàu', 'thịt kho tiêu', 'thịt kho gừng', 'thịt kho sả', 'thịt kho nghệ', 'thịt kho hành', 'thịt kho tỏi', 'gà xào sả', 'gà xào gừng', 'gà xào hành', 'gà xào tỏi', 'gà xào tiêu', 'gà xào nghệ', 'gà xào chanh', 'gà xào me', 'gà xào ớt', 'cá hấp gừng', 'cá hấp hành', 'cá hấp tỏi', 'cá hấp tiêu', 'cá hấp nghệ', 'cá hấp sả', 'cá hấp chanh', 'cá hấp me', 'cá hấp ớt', 'thịt bò xào', 'thịt heo xào', 'thịt gà kho', 'thịt vịt kho', 'thịt ngan kho', 'cá kho', 'tôm kho', 'cua kho', 'thịt bò hấp', 'thịt heo hấp', 'thịt gà hấp', 'thịt vịt hấp', 'thịt ngan hấp', 'cá nướng', 'thịt nướng', 'gà nướng', 'thịt luộc', 'gà luộc', 'cá luộc', 'tôm luộc', 'cua luộc', 'thịt chiên']
    },
    'soup': {
        'count': 50,
        'keywords': ['cháo', 'súp', 'canh', 'cháo gà', 'cháo vịt', 'cháo cá', 'cháo tôm', 'cháo thịt', 'cháo rau', 'cháo đậu', 'cháo khoai', 'cháo bí', 'cháo mãng cầu', 'cháo xoài', 'cháo dừa', 'cháo sấu', 'cháo me', 'cháo nhãn', 'cháo vú sữa', 'súp gà', 'súp vịt', 'súp cá', 'súp tôm', 'súp thịt', 'súp rau', 'súp đậu', 'súp khoai', 'súp bí', 'súp mãng cầu', 'súp xoài', 'súp dừa', 'súp sấu', 'súp me', 'súp nhãn', 'súp vú sữa', 'canh gà', 'canh vịt', 'canh cá', 'canh tôm', 'canh thịt', 'canh rau', 'canh đậu', 'canh khoai', 'canh bí', 'canh mãng cầu', 'canh xoài', 'canh dừa', 'canh sấu', 'canh me', 'canh nhãn']
    },
    'vegetable': {
        'count': 50,
        'keywords': ['rau xào', 'salad rau', 'rau muống xào', 'rau ngót xào', 'rau dền xào', 'rau má xào', 'rau diếp xào', 'rau thơm xào', 'rau xà lách xào', 'rau bina xào', 'rau cải xào', 'rau củ xào', 'rau muống luộc', 'rau ngót luộc', 'rau dền luộc', 'rau má luộc', 'rau diếp luộc', 'rau thơm luộc', 'rau xà lách luộc', 'rau bina luộc', 'rau cải luộc', 'rau củ luộc', 'salad rau muống', 'salad rau ngót', 'salad rau dền', 'salad rau má', 'salad rau diếp', 'salad rau thơm', 'salad rau xà lách', 'salad rau bina', 'salad rau cải', 'salad rau củ', 'rau hấp', 'rau nướng', 'rau kho', 'rau rim', 'rau sốt', 'rau trộn', 'rau nấu', 'rau hầm', 'rau chiên', 'rau rán', 'rau nướng', 'rau áp chảo', 'rau xào tỏi', 'rau xào hành', 'rau xào gừng', 'rau xào sả', 'rau xào tiêu', 'rau xào nghệ']
    },
    'other': {
        'count': 50,
        'keywords': ['món đặc biệt', 'món lạ', 'thịt dê kho', 'thịt cừu kho', 'thịt ngựa kho', 'thịt bò khô', 'thịt heo khô', 'thịt gà khô', 'thịt vịt khô', 'thịt ngan khô', 'cá khô', 'tôm khô', 'cua khô', 'thịt dê xào', 'thịt cừu xào', 'thịt ngựa xào', 'thịt bò khô xào', 'thịt heo khô xào', 'thịt gà khô xào', 'thịt vịt khô xào', 'thịt ngan khô xào', 'cá khô xào', 'tôm khô xào', 'cua khô xào', 'thịt dê hấp', 'thịt cừu hấp', 'thịt ngựa hấp', 'thịt bò khô hấp', 'thịt heo khô hấp', 'thịt gà khô hấp', 'thịt vịt khô hấp', 'thịt ngan khô hấp', 'cá khô hấp', 'tôm khô hấp', 'cua khô hấp', 'thịt dê nướng', 'thịt cừu nướng', 'thịt ngựa nướng', 'thịt bò khô nướng', 'thịt heo khô nướng', 'thịt gà khô nướng', 'thịt vịt khô nướng', 'thịt ngan khô nướng', 'cá khô nướng', 'tôm khô nướng', 'cua khô nướng', 'thịt dê luộc', 'thịt cừu luộc', 'thịt ngựa luộc', 'thịt bò khô luộc']
    }
}

# Yin yang properties
yin_yang_options = ['ôn', 'hàn', 'mát', 'nhiệt']

# Seasons
season_options = ['xuân', 'hè', 'thu', 'đông']

# Difficulties
difficulty_options = ['dễ', 'trung bình', 'khó']

# Price levels
price_options = ['thấp', 'trung bình', 'cao']

# Cooking methods
cooking_methods = ['hầm', 'nấu', 'xào', 'rán', 'chiên', 'kho', 'hấp', 'luộc', 'nướng', 'trộn', 'salad']

# Tastes
taste_options = ['ngọt', 'chua', 'cay', 'mặn', 'đắng', 'thơm', 'ấm', 'mát', 'giòn', 'mềm']

# Health benefits (based on traditional medicine)
health_benefits_options = ['tán hàn', 'thanh nhiệt', 'giải độc', 'bổ khí', 'kiện tỳ', 'ấm bụng', 'lợi tiểu', 'mát gan', 'nhuận tràng', 'giải cảm', 'bổ thận', 'đen tóc', 'cường gân cốt', 'bổ huyết', 'an thần', 'tiêu đờm', 'hoà vị', 'sơ can', 'thanh tâm', 'bổ phế']

# Suitable for symptoms
suitable_for_options = ['hàn', 'nhiệt', 'tiêu hóa yếu', 'cảm lạnh', 'sau ốm', 'phụ nữ sau sinh', 'thận hư', 'gan nóng', 'táo bón', 'tiêu chảy', 'mụn nhọt', 'rụng tóc', 'mệt mỏi', 'thiếu máu', 'mất ngủ', 'ho', 'đau bụng', 'đau đầu', 'chóng mặt', 'buồn nôn', 'nóng trong', 'lạnh tay chân', 'phù nề', 'huyết áp cao', 'huyết áp thấp']

# Contraindications
contraindications_options = ['nhiệt', 'hàn', 'tiêu chảy', 'táo bón', 'dị ứng', 'huyết áp cao', 'huyết áp thấp', 'thận hư nặng', 'gan bệnh', 'bệnh gout', 'viêm họng cấp', 'sốt cao', 'mang thai', 'cho con bú', 'trẻ em']

# Vitamins
vitamins_options = ['A', 'B1', 'B2', 'B6', 'B12', 'C', 'D', 'E', 'K']

# Minerals
minerals_options = ['canxi', 'sắt', 'kali', 'magie', 'kẽm', 'photpho', 'natri']

def generate_dish(id_num, category, keyword):
    if category == 'beverage':
        name = f"{keyword}"
    elif category == 'dessert':
        name = f"{keyword}"
    elif category == 'sweet_dish':
        name = f"{keyword}"
    elif category == 'side':
        name = f"{keyword}"
    elif category == 'main_savoury':
        name = f"{keyword}"
    elif category == 'soup':
        name = f"{keyword}"
    elif category == 'vegetable':
        name = f"{keyword}"
    elif category == 'other':
        name = f"{keyword}"

    description = f"Món {name.lower()} bổ dưỡng, phù hợp với y học cổ truyền Việt Nam"

    ingredients = [keyword.split()[0]] + random.sample(['gừng', 'hành', 'tỏi', 'sả', 'chanh', 'me', 'đường phèn', 'muối', 'gia vị'], random.randint(2, 5))

    yin_yang = random.choice(yin_yang_options)
    seasons = random.sample(season_options, random.randint(1, 4))
    difficulty = random.choice(difficulty_options)
    price_level = random.choice(price_options)
    prep_time = f"{random.randint(15, 120)} phút"
    servings = random.randint(2, 6)
    cooking_method = random.choice(cooking_methods)
    taste = random.sample(taste_options, random.randint(2, 4))

    # Nutritional values (approximate)
    nutritional_value = {
        "calories": random.randint(100, 500),
        "protein": random.randint(5, 25),
        "carb": random.randint(10, 50),
        "fat": random.randint(2, 20),
        "fiber": random.randint(1, 10),
        "sodium": random.randint(100, 800),
        "cholesterol": random.randint(0, 100)
    }

    health_benefits = random.sample(health_benefits_options, random.randint(2, 5))
    suitable_for = random.sample(suitable_for_options, random.randint(2, 5))
    contraindications = random.sample(contraindications_options, random.randint(1, 3))
    vitamins = random.sample(vitamins_options, random.randint(1, 4))
    minerals = random.sample(minerals_options, random.randint(1, 4))

    traditional_indication = f"Trị {', '.join(random.sample(suitable_for_options, 2))}"
    tips = f"Ăn {random.choice(['nóng', 'ấm', 'nguội', 'lạnh'])} để tăng hiệu quả"

    return {
        "id": id_num,
        "name": name,
        "description": description,
        "ingredients": ingredients,
        "yin_yang_property": yin_yang,
        "seasons": seasons,
        "difficulty": difficulty,
        "price_level": price_level,
        "preparation_time": prep_time,
        "servings": servings,
        "cooking_method": cooking_method,
        "taste": taste,
        "nutritional_value": nutritional_value,
        "health_benefits": health_benefits,
        "suitable_for": suitable_for,
        "contraindications": contraindications,
        "vitamins": vitamins,
        "minerals": minerals,
        "traditional_indication": traditional_indication,
        "tips": tips,
        "match_score": 0.0
    }

new_dishes = []
current_id = start_id

for category, info in categories.items():
    for i in range(info['count']):
        keyword = random.choice(info['keywords'])
        dish = generate_dish(current_id, category, keyword)
        new_dishes.append(dish)
        current_id += 1

# Append new dishes to existing ones
data['dishes'].extend(new_dishes)

# Save back to file
with open('data/knowledge_base.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_dishes)} new dishes to knowledge_base.json")