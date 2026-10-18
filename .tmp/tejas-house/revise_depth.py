from pathlib import Path
p=Path('.tmp/tejas-house/prepare_depth.py');s=p.read_text()
a=s.index(' scale,bias=np.linalg.lstsq')
b=s.index(' radial[:,0]',a)
s=s[:a]+''' scale,bias=.65,.09
 estimated=1/np.maximum(.07,normal*scale+bias)
 middle=np.clip((yy/(H-1)-.31)/.12,0,1)*np.clip((.80-yy/(H-1))/.12,0,1)
 foreground=np.clip((normal-.12)/.4,0,1)*middle
 radial=wall*(1-foreground)+np.minimum(wall,estimated)*foreground
 radial=np.clip(radial,wall*.25,wall)
'''+s[b:]
p.write_text(s)
