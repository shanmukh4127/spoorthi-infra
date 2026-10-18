from pathlib import Path
p=Path('src/components/tejes/journey/reconstructHouseRoom.js')
s=p.read_text();start=s.index('// Rectangular');end=s.index('// A room is')
p.write_text("import {BufferGeometry,Float32BufferAttribute} from 'three'\n\n"+s[start:end])
