from flask import Flask, request
import cv2
import mediapipe as mp
import numpy as np
import math
import os

app = Flask(__name__)

class poseDetector() :
    
    def __init__(self, mode=False, complexity=1, smooth_landmarks=True,
                 enable_segmentation=False, smooth_segmentation=True,
                 detectionCon=0.5, trackCon=0.5):
        
        self.mode = mode #是否是动态图片
        self.complexity = complexity
        self.smooth_landmarks = smooth_landmarks #设置为True缩小抖动
        self.enable_segmentation = enable_segmentation
        self.smooth_segmentation = smooth_segmentation
        self.detectionCon = detectionCon  #人员检测模型的最小置信度值，默认为0.5
        self.trackCon = trackCon  #姿态可信标记的最小置信度值，默认为0.5
        
        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(self.mode, self.complexity, self.smooth_landmarks,
                                     self.enable_segmentation, self.smooth_segmentation,
                                     self.detectionCon, self.trackCon)
        
        
    def findPose (self, img, draw=True):
        '''
        检测姿态办法
        :img: 一帧图像
        :draw: 是否画出人体姿态节点和连贯图
        :return: 解决过的图像
        '''
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)
        # pose.process(imgRGB) 会辨认这帧图片中的人体姿态数据，保留到self.results中
        if self.results.pose_landmarks:
            if draw:
                self.mpDraw.draw_landmarks(img,self.results.pose_landmarks,
                                           self.mpPose.POSE_CONNECTIONS)
                
        return img
    
    def findPosition(self, img, draw=True):
        '''
        获取人体姿态数据
        :param img: 一帧图像
        :param draw: 是否画出人体姿态节点和连贯图
        :return: 人体姿态数据列表
        '''
        # 人体姿态数据列表，每个成员由3个数字组成：id, x, y
        # id代表人体的某个关节点，x和y代表坐标地位数据
        self.lmList = []
        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                #finding height, width of the image printed
                h, w, c = img.shape
                #Determining the pixels of the landmarks
                cx, cy = int(lm.x * w), int(lm.y * h)
                self.lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255,0,0), cv2.FILLED)
        return self.lmList
        
    def findAngle(self, img, p1, p2, p3, draw=True):  
        '''
        获取人体姿态中3个点p1-p2-p3的角度
        :param img: 一帧图像
        :param p1: 第1个点
        :param p2: 第2个点
        :param p3: 第3个点
        :param draw: 是否画出3个点的连贯图
        :return: 角度
        ''' 
        #Get the landmarks
        x1, y1 = self.lmList[p1][1:]
        x2, y2 = self.lmList[p2][1:]
        x3, y3 = self.lmList[p3][1:]
        
        #Calculate Angle
        # 应用三角函数公式获取3个点p1-p2-p3，以p2为角的角度值，0-180度之间
        angle = math.degrees(math.atan2(y3-y2, x3-x2) - 
                             math.atan2(y1-y2, x1-x2))
        if angle < 0:
            angle += 360
            if angle > 180:
                angle = 360 - angle
        elif angle > 180:
            angle = 360 - angle
        # print(angle)
        
        #Draw
        if draw:
            cv2.line(img, (x1, y1), (x2, y2), (255,255,255), 3)
            cv2.line(img, (x3, y3), (x2, y2), (255,255,255), 3)

            
            cv2.circle(img, (x1, y1), 5, (0,0,255), cv2.FILLED)
            cv2.circle(img, (x1, y1), 15, (0,0,255), 2)
            cv2.circle(img, (x2, y2), 5, (0,0,255), cv2.FILLED)
            cv2.circle(img, (x2, y2), 15, (0,0,255), 2)
            cv2.circle(img, (x3, y3), 5, (0,0,255), cv2.FILLED)
            cv2.circle(img, (x3, y3), 15, (0,0,255), 2)
            
            cv2.putText(img, str(int(angle)), (x2-50, y2+50), 
                        cv2.FONT_HERSHEY_PLAIN, 2, (0,0,255), 2)
        return angle



def result(imge):
    detector = poseDetector()

    img=cv2.imread(imge)
    img = cv2.flip(img,1)
    img = detector.findPose(img, False)
    lmList = detector.findPosition(img, False)
    # print(lmList)
    if len(lmList) != 0:
        elbow = detector.findAngle(img, 11, 13, 15)
        shoulder = detector.findAngle(img, 13, 11, 23)
        hip = detector.findAngle(img, 11, 23,25)
        
        # #Percentage of success of pushup 俯卧撑成功率
        per = np.interp(elbow, (90, 160), (100, 0))
        
        return [elbow,shoulder,hip,per]

def SecResult(imge):
    detector = poseDetector()
    img=cv2.imread(imge)
    img = cv2.flip(img,1)
    img = detector.findPose(img, False)
    lmList = detector.findPosition(img, False)
    # print(lmList)
    if len(lmList) != 0:
        # 获取仰卧起坐的角度
        angle1 = detector.findAngle(img, 11, 23, 25)
        angle2 = detector.findAngle(img,23,25,27)
        angle2 = 360 - angle2

        return [angle1,angle2]


@app.route("/")
def helloworld():
    return 'HelloWorld'

@app.route("/upload" ,methods=['POST', 'GET'])
def upload():
    f = request.files.get('file')
    print(f)
    upload_path = os.path.join("tmp/tmp." + f.filename.split(".")[-1])
    print(upload_path)
    f.save(upload_path)
    return upload_path

@app.route("/detect")
def inference():
    im_url = request.args.get("url")
    return str(result(im_url))


@app.route("/situp")
def stinference():
    im_url = request.args.get("url")
    return str(SecResult(im_url))

if __name__ == '__main__':
    app.run(host='192.168.33.1', port=90 , debug=True) #host内更改为当前的ip地址
    # from gevent import pywsgi

    # server = pywsgi.WSGIServer(('0.0.0.0',5000),app)
    # server.serve_forever()