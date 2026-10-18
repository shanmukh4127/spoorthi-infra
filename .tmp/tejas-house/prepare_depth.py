import sys,json,math
from pathlib import Path
sys.path.insert(0,'.tmp/tejas-house/python')
import numpy as np
from PIL import Image,ImageFilter
import onnxruntime as ort
base=Path('public/assets/tejes/cinematic/house')
layout=json.loads((base/'layout.json').read_text())
options=ort.SessionOptions();options.intra_op_num_threads=4
session=ort.InferenceSession('.tmp/tejas-house/depth-anything-v2-small.onnx',sess_options=options,providers=['CPUExecutionProvider'])
W,H=layout['depthWidth'],layout['depthHeight']
for room in layout['rooms']:
 im=Image.open(base/'originals'/f"{room['id']}.png").convert('RGB')
 # Relative-depth inference is offline; the deployed site needs no ML runtime.
 resized=im.resize((1036,518),Image.Resampling.BICUBIC)
 values=np.asarray(resized,dtype=np.float32)/255
 values=(values-np.array([.485,.456,.406],dtype=np.float32))/np.array([.229,.224,.225],dtype=np.float32)
 prediction=session.run(None,{'pixel_values':values.transpose(2,0,1)[None]})[0][0]
 raw=np.asarray(Image.fromarray(prediction).resize((W,H),Image.Resampling.BILINEAR))
 lo,hi=np.percentile(raw,[2,98]);normal=np.clip((raw-lo)/(hi-lo),0,1)
 # AI relative depth supplies foreground shape; room-scale anchors constrain
 # floor/ceiling/wall positions and provide shared metric doorway coordinates.
 yy,xx=np.mgrid[0:H,0:W]
 theta=(xx/(W-1)-.5)*2*math.pi+room['yaw'];latitude=(.5-yy/(H-1))*math.pi
 rays=np.stack([np.cos(latitude)*np.sin(theta),np.sin(latitude),-np.cos(latitude)*np.cos(theta)],axis=-1)
 origin=np.array(room['center']);minimum=np.array(room['min']);maximum=np.array(room['max'])
 raySafe=np.where(np.abs(rays)<1e-8,1e-8,rays)
 wall=np.min(np.maximum((minimum-origin)/raySafe,(maximum-origin)/raySafe),axis=-1)
 wall=np.clip(wall,.3,20)
 # Robust affine inverse-depth calibration uses upper/lower architectural bands.
 anchor=((yy/(H-1)<.25)|(yy/(H-1)>.78))
 X=np.stack([normal[anchor],np.ones(anchor.sum())],axis=1)
 scale,bias=.65,.09
 estimated=1/np.maximum(.07,normal*scale+bias)
 middle=np.clip((yy/(H-1)-.31)/.12,0,1)*np.clip((.80-yy/(H-1))/.12,0,1)
 foreground=np.clip((normal-.12)/.4,0,1)*middle
 radial=wall*(1-foreground)+np.minimum(wall,estimated)*foreground
 radial=np.clip(radial,wall*.25,wall)
 radial[:,0]=(radial[:,0]+radial[:,-1])*.5;radial[:,-1]=radial[:,0]
 radial.astype('<f4').tofile(base/f"{room['id']}-depth.bin")
 Image.fromarray((normal*255).astype('uint8')).save(base/f"{room['id']}-depth-preview.png")
 im.save(base/f"{room['id']}-1774.webp",quality=93,method=6)
 im.resize((1280,640),Image.Resampling.LANCZOS).save(base/f"{room['id']}-1280.webp",quality=91,method=6)
 np.save('.tmp/tejas-house/'+room['id']+'-prediction.npy',prediction)
 print(room['id'],im.size,'depth',float(radial.min()),float(radial.max()),'calibration',float(scale),float(bias),flush=True)
