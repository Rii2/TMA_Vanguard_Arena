from PIL import Image
import os

def create_thumbnails():
    source_dir = "soldier"
    thumb_dir = os.path.join(source_dir, "thumbnails")
    
    # サムネイルディレクトリが存在しない場合は作成
    if not os.path.exists(thumb_dir):
        os.makedirs(thumb_dir)
    
    # 元の画像ファイルをループ
    for filename in os.listdir(source_dir):
        if filename.endswith(".png") and not filename.endswith("_thumb.png"):
            source_path = os.path.join(source_dir, filename)
            
            # サムネイル名を生成（例：bear.png → bear_thumb.png）
            thumb_name = os.path.splitext(filename)[0] + "_thumb.png"
            thumb_path = os.path.join(thumb_dir, thumb_name)
            
            try:
                # 画像を開いてリサイズ
                with Image.open(source_path) as img:
                    # 32x32にリサイズ、アンチエイリアス使用
                    thumb = img.resize((32, 32), Image.LANCZOS)
                    # 透過を保持して保存
                    thumb.save(thumb_path, "PNG", optimize=True)
                print(f"Created thumbnail: {thumb_name}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    create_thumbnails()