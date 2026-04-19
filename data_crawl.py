import requests
from bs4 import BeautifulSoup
import time

# Danh sách các URL bài học
urls = [
]

def scrape_codelab(url):
    print(f"Đang cào dữ liệu từ: {url}...")
    try:
        # Gửi request với Header để tránh bị chặn
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tìm tiêu đề chính của bài học
        title = soup.find('h1')
        title_text = title.get_text(strip=True) if title else "Không tìm thấy tiêu đề"
        
        # Tìm nội dung chính của phần (thường nằm trong thẻ <article> hoặc div có class 'step-content')
        # Google Codelabs thường đặt nội dung trong thẻ <google-codelab-step>
        content = soup.find('div', class_='instructions') or soup.find('article')
        
        if not content:
            # Fallback nếu cấu trúc class thay đổi
            content = soup.find('main')

        data = {
            'url': url,
            'title': title_text,
            'body': []
        }

        if content:
            # Lấy tất cả các đoạn văn và các khối code
            for element in content.find_all(['p', 'h2', 'h3', 'pre', 'code']):
                tag_name = element.name
                text = element.get_text(strip=True)
                if text:
                    data['body'].append({
                        'type': tag_name,
                        'text': text
                    })
        
        return data

    except Exception as e:
        return {"error": f"Lỗi khi cào {url}: {e}"}

def save_to_file(results):
    with open("android_codelabs_data.txt", "w", encoding="utf-8") as f:
        for result in results:
            if "error" in result:
                f.write(f"{result['error']}\n\n")
                continue
                
            f.write(f"URL: {result['url']}\n")
            f.write(f"TIÊU ĐỀ: {result['title']}\n")
            f.write("-" * 50 + "\n")
            for item in result['body']:
                if item['type'] in ['h2', 'h3']:
                    f.write(f"\n--- {item['text']} ---\n")
                elif item['type'] in ['pre', 'code']:
                    f.write(f"\n[CODE BLOCK]:\n{item['text']}\n[END CODE]\n")
                else:
                    f.write(f"{item['text']}\n")
            f.write("\n" + "="*80 + "\n\n")

if __name__ == "__main__":
    all_data = []
    for url in urls:
        data = scrape_codelab(url)
        all_data.append(data)
        # Nghỉ 1 chút để tránh bị coi là spam
        time.sleep(1)
    
    save_to_file(all_data)
    print("Xong! Dữ liệu đã được lưu vào file data.txt")