import os
import re
import glob

def fix_css():
    css_path = "101/gutenverse/font-icon/fonts/fontawesome/css/all.min.css"
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()
        content = content.replace("font-display:block;", "font-display:swap;")
        with open(css_path, "w", encoding="utf-8") as f:
            f.write(content)

def fix_html_files():
    html_files = glob.glob("*.html")
    for file in html_files:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        filename = file if file != 'index.html' else ''
        canonical_tag = f'<link rel="canonical" href="https://primassociates.com/{filename}">'
        robots_tag = '<meta name="robots" content="index, follow">'
        
        # Inject meta and canonical
        if 'rel="canonical"' not in content:
            content = re.sub(r'</head>', f'    {canonical_tag}\n    {robots_tag}\n</head>', content, flags=re.IGNORECASE)

        # Preload hero image in index
        if file == "index.html":
            preload_tag = '<link rel="preload" as="image" href="images/hero.png" fetchpriority="high">'
            if 'fetchpriority="high"' not in content:
                content = re.sub(r'</head>', f'    {preload_tag}\n</head>', content, flags=re.IGNORECASE)

        # Fix missing aria-labels
        content = re.sub(r'<a[^>]*href="#"[^>]*>\s*<i class="fa-brands fa-facebook-f"></i>\s*</a>', r'<a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>', content)
        content = re.sub(r'<a[^>]*href="#"[^>]*>\s*<i class="fa-brands fa-linkedin-in"></i>\s*</a>', r'<a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>', content)
        content = re.sub(r'<a[^>]*href="#"[^>]*>\s*<i class="fa-brands fa-instagram"></i>\s*</a>', r'<a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>', content)
        content = re.sub(r'<a[^>]*href="#"[^>]*>\s*<i class="fa-brands fa-youtube"></i>\s*</a>', r'<a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>', content)

        # Fix images: add loading="lazy" and alt
        def replace_img(match):
            img_tag = match.group(0)
            src_match = re.search(r'src="([^"]+)"', img_tag)
            if not src_match:
                return img_tag
            src = src_match.group(1)

            # Lazy loading
            if 'hero' not in src and 'loading=' not in img_tag:
                img_tag = img_tag.replace('<img ', '<img loading="lazy" ')

            # Alt tags
            if 'alt=""' in img_tag:
                desc = os.path.basename(src).split('.')[0].replace('-', ' ').title()
                img_tag = img_tag.replace('alt=""', f'alt="{desc}"')
            elif 'alt=' not in img_tag:
                desc = os.path.basename(src).split('.')[0].replace('-', ' ').title()
                img_tag = img_tag.replace('<img ', f'<img alt="{desc}" ')

            return img_tag

        content = re.sub(r'<img [^>]+>', replace_img, content)

        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == '__main__':
    fix_css()
    fix_html_files()
