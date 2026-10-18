import sys
sys.path.insert(0,'.tmp/tejas-house/python')
import onnxruntime as ort
session=ort.InferenceSession('.tmp/tejas-house/depth-anything-v2-small.onnx',providers=['CPUExecutionProvider'])
print([(i.name,i.shape,i.type) for i in session.get_inputs()])
print([(i.name,i.shape,i.type) for i in session.get_outputs()])
