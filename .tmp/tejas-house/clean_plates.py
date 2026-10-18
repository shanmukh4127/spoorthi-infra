from PIL import Image,ImageChops,ImageFilter
from pathlib import Path
import numpy as np
base=Path('public/assets/tejes/cinematic/house')
regions={'main':[(.20,.40,.44,.82),(.41,.60,.50,.70),(.64,.99,.44,.87)],'foyer':[(.17,.34,.40,.87),(.22,.78,.64,.99)],'bedroom':[(.01,.2,.48,.8),(.29,.74,.46,.95)],'bathroom':[(.10,.32,.47,.85)]}
for name in regions:
 original=Image.open(base/'originals'/f'{name}.png').convert('RGB')
 clean=Image.open(base/'originals'/f'{name}-clean.png').convert('RGB').resize(original.size)
 a,b=np.array(original).astype(float),np.array(clean).astype(float)
 difference=np.max(np.abs(a-b),axis=2)
 h,w=difference.shape;yy,xx=np.mgrid[0:h,0:w];allowed=np.zeros((h,w),bool)
 for x0,x1,y0,y1 in regions[name]:allowed|=(xx>=w*x0)&(xx<=w*x1)&(yy>=h*y0)&(yy<=h*y1)
 mask=Image.fromarray((np.clip((difference-17)/22,0,1)*allowed*255).astype('uint8')).filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.MaxFilter(3))
 mask.save(base/f'{name}-foreground-mask.png')
 clean.save(base/f'{name}-clean-1774.webp',quality=93,method=6)
 clean.resize((1280,640),Image.Resampling.LANCZOS).save(base/f'{name}-clean-1280.webp',quality=91,method=6)
 print(name,flush=True)
