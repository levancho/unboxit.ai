"""Original educational motion design. Optional ElevenLabs narration is muxed locally."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import argparse, math, json, subprocess, functools
import numpy as np
P=Path(__file__).parent; OUT=P/'dist'; W,H=1280,720; FPS=30
BIN=Path('C:/Users/dleva/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin')
ORANGE='#ff7955'; BLUE='#94a0ff'; LIME='#d7fa78'; WHITE='#f6f5f2'; MUTED='#a5abc4'
@functools.lru_cache(None)
def font(n,bold=False):return ImageFont.truetype('C:/Windows/Fonts/'+('arialbd.ttf' if bold else 'arial.ttf'),n)
def txt(d,x,y,s,size=24,color=WHITE,bold=False):d.text((round(x),round(y)),s,font=font(size,bold),fill=color)
def ease(v):return 1-(1-max(0,min(1,v)))**3
def box(d,xy,fill='#202332',outline='#3a3e54',r=15,width=1):d.rounded_rectangle(tuple(round(v) for v in xy),radius=r,fill=fill,outline=outline,width=width)
def wrap(s,maxchars=87):
 lines=['']
 for word in s.split():
  if len(lines[-1])+len(word)+1>maxchars:lines.append(word)
  else:lines[-1]+=(' ' if lines[-1] else '')+word
 return lines
def fit_lines(d,s,size,width):
 lines=['']
 for word in s.split():
  candidate=(lines[-1]+' '+word).strip()
  if d.textlength(candidate,font=font(size,True))>width and lines[-1]:lines.append(word)
  else:lines[-1]=candidate
 return lines
yy,xx=np.mgrid[0:H,0:W];g=np.exp(-((xx-900)**2/340000+(yy-270)**2/130000))
bg=np.zeros((H,W,3),dtype=np.uint8)
for c,(base,extra) in enumerate([(15,16),(16,19),(24,38)]):bg[:,:,c]=base+g*extra
BG=Image.fromarray(bg)
def network(d,t,area=(560,220,1160,510),highlight=0):
 x0,y0,x1,y1=area;layers=[]
 for l,n in enumerate([3,5,5,3]):layers.append([(x0+(x1-x0)*l/3,(y0+y1)/2+(i-(n-1)/2)*55) for i in range(n)])
 for l,layer in enumerate(layers[:-1]):
  for i,a in enumerate(layer):
   for j,b in enumerate(layers[l+1]):
    d.line([a,b],fill='#414b72' if (i+j)%3==0 else '#2d354e',width=1+(i+j)%2)
    q=(t*.4+i*.11+j*.19-l*.19)%1
    x=a[0]+(b[0]-a[0])*q;y=a[1]+(b[1]-a[1])*q
    d.ellipse((x-3,y-3,x+3,y+3),fill=ORANGE if highlight else BLUE)
 for l,layer in enumerate(layers):
  for i,(x,y) in enumerate(layer):
   rad=8+math.sin(t*2+l+i)*1.5
   for add,col in [(14,'#222a43'),(7,'#354365'),(0,ORANGE if l==3 else BLUE)]:d.ellipse((x-rad-add,y-rad-add,x+rad+add,y+rad+add),fill=col)
 for x,s in [(x0-22,'INPUT'),((x0+x1)/2-55,'CONNECTIONS'),(x1-32,'OUTPUT')]:txt(d,x,y1+35,s,14,MUTED,True)
DATA=[(.08,.18),(.14,.24),(.22,.22),(.28,.34),(.37,.33),(.43,.48),(.51,.45),(.58,.59),(.65,.6),(.72,.7),(.82,.71),(.89,.84)]
def plot(d,p,training=False,test=False):
 left,top,right,bottom=535,225,1180,510
 def px(x):return left+x*(right-left)
 def py(y):return bottom-y*(bottom-top)
 for j in range(5):
  y=j/4;d.line((left,py(y),right,py(y)),fill='#353a50');txt(d,left-42,py(y)-8,str(int(y*100)),15,MUTED)
 txt(d,left,top-38,'SCOOPS SOLD',14,MUTED,True);txt(d,720,bottom+24,'COOLER        TEMPERATURE        HOTTER',14,MUTED)
 f=ease(p*.95) if training else 0;slope=-.3+1.04*f;bias=.85-.69*f
 for i,(x,y) in enumerate(DATA):
  reveal=ease(p*5-i*.12) if not training and not test else 1
  if reveal<=0:continue
  if training:d.line((px(x),py(y),px(x),py(slope*x+bias)),fill='#6a5570',width=2)
  r=6*reveal;d.ellipse((px(x)-r,py(y)-r,px(x)+r,py(y)+r),fill=BLUE)
 if training or test:
  if test:slope=.74;bias=.16
  d.line((px(0),py(bias),px(1),py(slope+bias)),fill=ORANGE,width=4)
 if test:
  x=.6;y=.61;cx=px(x);cy=py(y);r=8
  d.ellipse((cx-18,cy-18,cx+18,cy+18),outline=LIME,width=2);d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=LIME)
  box(d,(cx-90,cy-83,cx+135,cy-37),'#263324','#57664a');txt(d,cx-76,cy-72,'A NEW, UNSEEN DAY',15,LIME,True)
def tokens(d,words,x,y,active=-1,scale=1):
 for i,s in enumerate(words):
  width=int(d.textlength(s,font=font(int(32*scale),True)))+30
  box(d,(x,y,x+width,y+64),ORANGE if i==active else '#282e49',None,12)
  txt(d,x+15,y+11,s,int(32*scale),'#18141a' if i==active else WHITE,True);x+=width+12
 return x
def probabilities(d,p,temp=0):
 vals=[.65-temp*.25,.30+temp*.03,.05+temp*.22]
 for i,(s,v) in enumerate(zip(['mat','sofa','moon'],vals)):
  y=328+i*64;txt(d,550,y-5,s,24);box(d,(650,y,1120,y+20),'#2e344b',None,8)
  box(d,(650,y,650+max(3,470*v*ease(p*3)),y+20),ORANGE if i==0 else BLUE,None,8);txt(d,1140,y-6,str(round(v*100))+'%',20,MUTED)
 txt(d,550,540,'ILLUSTRATIVE PROBABILITIES',13,MUTED,True)
def render_frame(name,scene,p,t,total,story,caption):
 im=BG.copy();d=ImageDraw.Draw(im)
 for x in range(30,W,40):
  for y in range(30,H,40):d.ellipse((x,y,x+1,y+1),fill='#303448')
 d.line((48,80,1232,80),fill='#363b50');txt(d,48,28,'AI, UNBOXED',19,WHITE,True);txt(d,980,30,'THE VISUAL FIELD GUIDE',13,MUTED,True)
 sx=48;ent=ease(p*8);offset=28*(1-ent)
 txt(d,sx,126,'0'+str(scene+1)+' / '+('LEARNING' if name=='learning' else 'GENERATING'),14,ORANGE,True)
 titles=story[scene];titleLines=fit_lines(d,titles['title'],48,420);y=198+offset
 for line in titleLines:txt(d,sx,y,line,48,WHITE,True);y+=57
 for line in fit_lines(d,titles['accent'],42,420):txt(d,sx,y+8,line,42,ORANGE if name=='learning' else BLUE,True);y+=51
 box(d,(48,496,380,540),'#202433','#3c425a',8);txt(d,64,508,'A SMALL IDEA. A BIG DIFFERENCE.',13,MUTED,True)
 if name=='learning':
  if scene==0:
   for i,label in enumerate(['EXAMPLES','PATTERNS','PREDICTIONS']):
    y=220+i*104;appear=ease(p*5-i*.55);xx=540+(1-appear)*110
    box(d,(xx,y,1180,y+76),'#252c44' if i==1 else '#1e2232','#48516e',13)
    txt(d,xx+23,y+21,'0'+str(i+1),23,ORANGE);txt(d,xx+85,y+18,label,29,WHITE,True)
    if i<2:d.line((860,y+77,860,y+102),fill=BLUE,width=2)
  elif scene==1:plot(d,p)
  elif scene==2:
   plot(d,p,training=True);f=ease(p*.95);m=-.3+1.04*f;b=.85-.69*f;err=100*math.sqrt(sum((m*x+b-y)**2 for x,y in DATA)/len(DATA));box(d,(960,140,1180,206),'#272936','#474c63');txt(d,978,157,'ERROR  '+str(round(err,1)),26,LIME,True)
  elif scene==3:network(d,t,highlight=1)
  elif scene==4:plot(d,p,test=True)
  else:
   for i,(label,color) in enumerate([('LEARN',BLUE),('TEST',LIME),('CHECK',ORANGE)]):
    x=560+i*210;cy=335;r=72+4*math.sin(t+i)
    d.ellipse((x-r,cy-r,x+r,cy+r),outline=color,width=3);txt(d,x-48,cy-15,label,24,color,True)
    if i<2:d.line((x+r,cy,x+210-r,cy),fill='#5b6483',width=3)
   txt(d,590,460,'GOOD PREDICTIONS NEED GOOD CHECKS.',17,MUTED,True)
 else:
  if scene==0:
   for i,(word,col) in enumerate([('Predict.',WHITE),('Add.',BLUE),('Repeat.',ORANGE)]):
    txt(d,590+int(30*(1-ease(p*5-i*.5))),190+i*105,word,75,col,True)
  elif scene==1:
   tokens(d,['un','believ','able','!'],550,278,active=int(t)%4,scale=.9)
   d.line((585,368,585,430),fill=BLUE,width=2);txt(d,550,452,'WORD PARTS',18,MUTED,True)
   d.line((1070,368,1070,430),fill=ORANGE,width=2);txt(d,957,452,'PUNCTUATION',18,MUTED,True)
   txt(d,550,204,'ONE POSSIBLE TOKENIZATION',14,MUTED,True)
  elif scene==2:
   tokens(d,['The','cat','sat','on','the'],535,220,scale=.7);probabilities(d,p)
  elif scene==3:
   groups=[['The','cat','sat','on','the'],['mat','and','watched'],['the','rain','.']];n=min(11,int(p*14)+1);count=0
   for row,words in enumerate(groups):
    shown=words[:max(0,n-count)];tokens(d,shown,535,210+row*104,active=len(shown)-1,scale=.7);count+=len(words)
  elif scene==4:
   tokens(d,['The','cat','sat','on','the'],535,210,scale=.7);probabilities(d,1,temp=.5-.5*math.cos(p*math.pi));txt(d,550,580,'LOW',13,MUTED);txt(d,1110,580,'HIGH',13,MUTED)
   d.line((610,590,1090,590),fill='#697196',width=3);x=610+480*p;d.ellipse((x-9,581,x+9,599),fill=LIME)
  else:
   box(d,(550,230,1180,385),'#262c42','#56607e',18);txt(d,580,254,'"Definitely. Absolutely. 100%."',29,WHITE,True);txt(d,580,319,'CONFIDENT WORDING',15,MUTED,True)
   d.line((865,390,865,440),fill=ORANGE,width=3);box(d,(550,448,1180,527),'#313027','#797052',13);txt(d,605,471,'WHERE IS THE EVIDENCE?',27,LIME,True)
 box(d,(40,621,1240,682),'#11151f',None,12)
 caplines=wrap(caption,94)
 for j,line in enumerate(caplines):
  width=d.textlength(line,font=font(21));txt(d,(W-width)/2,631+j*25,line,21,WHITE)
 for i in range(6):
  x=48+i*199;d.line((x,703,x+184,703),fill=ORANGE if i<scene else '#42485d',width=3)
  if i==scene:d.line((x,703,x+184*p,703),fill=ORANGE,width=3)
 return im
def stamp(s):
 ms=round(s*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
def main():
 parser=argparse.ArgumentParser();parser.add_argument('name',choices=['learning','prediction']);parser.add_argument('--audio');args=parser.parse_args()
 film=json.loads((P/'films.json').read_text())[args.name];story=film['scenes'];words=[len(s['narration'].split()) for s in story];total=round(sum(words)/2.6+1,2)
 if args.audio:total=float(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',args.audio]).decode())
 limits=[0]
 for n in words:limits.append(limits[-1]+total*n/sum(words))
 captions=[]
 for i,s in enumerate(story):
  pieces=wrap(s['narration'],110);nwords=[len(c.split()) for c in pieces];start=limits[i]
  for c,n in zip(pieces,nwords):
   end=start+(limits[i+1]-limits[i])*n/sum(nwords);captions.append((start,end,c));start=end
 (OUT/(args.name+'.vtt')).write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(a)} --> {stamp(b)}\n{c}' for a,b,c in captions)+'\n',encoding='utf-8')
 cmd=[str(BIN/'ffmpeg.exe'),'-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','-']
 if args.audio:cmd+=['-i',args.audio,'-c:a','aac','-b:a','160k','-shortest']
 else:cmd+=['-an']
 cmd+=['-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/(args.name+'.mp4'))]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);scene=0;capidx=0
 for frame in range(math.ceil(total*FPS)):
  t=frame/FPS
  while scene<5 and t>=limits[scene+1]:scene+=1
  while capidx<len(captions)-1 and t>=captions[capidx][1]:capidx+=1
  p=(t-limits[scene])/(limits[scene+1]-limits[scene]);im=render_frame(args.name,scene,p,t,total,story,captions[capidx][2])
  if frame==int(total*.3*FPS):im.save(OUT/(args.name+'.jpg'),quality=94)
  proc.stdin.write(im.tobytes())
 proc.stdin.close()
 if proc.wait():raise RuntimeError('Encoding failed')
 print(json.dumps({'film':args.name,'seconds':total,'audio':bool(args.audio),'file':str(OUT/(args.name+'.mp4'))}),flush=True)
if __name__=='__main__':main()
