from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, subprocess
ROOT=Path(__file__).parent/'dist'
W,H=960,540
FONT='C:/Windows/Fonts/arial.ttf'
BOLD='C:/Windows/Fonts/arialbd.ttf'
def font(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def text(d,xy,s,size=24,fill='#f6f5f2',bold=False):d.text(xy,s,font=font(size,bold),fill=fill)
def base(k,t,title):
 im=Image.new('RGB',(W,H),'#111119');d=ImageDraw.Draw(im)
 for x in range(30,W,40):
  for y in range(20,H,40):d.ellipse((x,y,x+1,y+1),fill='#292936')
 text(d,(40,26),'AI, UNBOXED / MINI FILM 0'+str(k),14,'#b2b5ce',True)
 text(d,(40,64),title,38,bold=True)
 d.rounded_rectangle((40,507,920,511),radius=2,fill='#343442');d.rounded_rectangle((40,507,40+880*t/18,511),radius=2,fill='#fa6845')
 return im,d
def frame(k,t):
 phase=min(2,int(t/6));p=(t%6)/6
 if k==1:
  titles=['Examples become numbers.','Connections learn patterns.','A prediction is an educated guess.']
  im,d=base(k,t,titles[phase]);layers=[[(140+l*225,270+(i-(n-1)/2)*57) for i in range(n)] for l,n in enumerate([3,5,4,2])]
  for l in range(3):
   for i,a in enumerate(layers[l]):
    for j,b in enumerate(layers[l+1]):
     d.line([a,b],fill='#363c5a',width=2)
     q=(t*.5+i*.17+j*.13-l*.3)%1;x=a[0]+(b[0]-a[0])*q;y=a[1]+(b[1]-a[1])*q
     d.ellipse((x-3,y-3,x+3,y+3),fill='#ff805d' if phase==2 else '#a0adff')
  for l,ls in enumerate(layers):
   for x,y in ls:
    r=9+int(2*math.sin(t*3+l));d.ellipse((x-r-6,y-r-6,x+r+6,y+r+6),outline='#424966',width=1);d.ellipse((x-r,y-r,x+r,y+r),fill='#fa7957' if l==3 else '#97a6ff')
  for x,s in [(110,'INPUT'),(430,'PATTERNS'),(775,'OUTPUT')]:text(d,(x,405),s,14,'#acb2cd',True)
  captions=['Images, words, and sounds can be represented with numbers.','Training adjusts connections to reduce errors on examples.','New input flows through the trained model. Check the result.']
  text(d,(40,459),captions[phase],21)
 else:
  titles=['A sentence sets the context.','The model scores possible next tokens.','Choose, add, and repeat.']
  im,d=base(k,t,titles[phase]);words=['The','cat','sat','on','the'];x=55
  shown=min(5,1+int(t*1.3)) if phase==0 else 5
  for s in words[:shown]:
   ww=int(d.textlength(s,font=font(29)))+30;d.rounded_rectangle((x,172,x+ww,233),radius=10,fill='#292c43');text(d,(x+15,185),s,29);x+=ww+12
  if phase==2:
   s='mat' if p<.5 else 'mat.';d.rounded_rectangle((x,172,x+100,233),radius=10,fill='#fa6845');text(d,(x+15,185),s,29,'#17131a')
  options=[('mat',.65),('sofa',.25),('moon',.10)]
  for i,(s,v) in enumerate(options):
   y=273+i*48;text(d,(60,y),s,23);d.rounded_rectangle((160,y+5,850,y+22),radius=7,fill='#2d2d3c');width=690*v*(min(1,p*3) if phase==1 else 1);d.rounded_rectangle((160,y+5,160+max(10,width),y+22),radius=7,fill='#8897ff' if i else '#fa7957');text(d,(865,y-1),str(int(v*100))+'%',18,'#c2c6dd')
  captions=['Tokens are pieces of text: sometimes words, sometimes word parts.','These made-up probabilities illustrate prediction, not truth.','Each chosen token becomes context for the next prediction.']
  text(d,(40,459),captions[phase],21)
 return im
for k,name in [(1,'learning'),(2,'prediction')]:
 frame(k,7).save(ROOT/(name+'.jpg'),quality=90)
 cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/(name+'.mp4'))]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for i in range(432):proc.stdin.write(frame(k,i/24).tobytes())
 proc.stdin.close()
 if proc.wait()!=0:raise RuntimeError('Video encoding failed')
 print(name+' film generated',flush=True)
