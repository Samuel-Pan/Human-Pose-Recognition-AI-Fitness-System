## 基于人体姿态识别的AI健身系统
-----
**项目简介：**
本项目通过对前端微信小程序采集到的姿势特征图像通过后端flask接口调用，将图像上传至后端，在后端搭建基于MediaPipe Pose的算法系统，将相关姿态数据回传至前端小程序，在前端的算法中判断健身者的运动姿态，动作行程等运动特征是否符合标准动作要求，对其标准动作与各类非标准动作分别计数，并将结果实时显示在小程序运动界面，同时将运动记录上传至历史记录存储在数据库中。

![image](https://github.com/Samuel-Pan/Human-Pose-Recognition-AI-Fitness-System/assets/156978136/7497ea8c-95b5-49d0-a64b-3d5426c41705)


***相关技术：***

**项目框架：**

![image](https://github.com/Samuel-Pan/Human-Pose-Recognition-AI-Fitness-System/assets/156978136/bb9faac6-b2d4-42fe-b85f-2b3d48fff170)

 **1. 人体姿态识别检测**
本项目采用Python来实现姿态识别检测，通过引入了MediaPipe Pose框架实现对人体姿态的识别以及特征点的识别。以下是Mediapipe特征点标识及示意图：
![image](https://github.com/Samuel-Pan/Human-Pose-Recognition-AI-Fitness-System/assets/156978136/61d1d55a-1a10-4f5f-bb7f-337a6c89d678)

对于俯卧撑，则取点11、13、15确定肘关节角度，取点13、11、23确定肩部角度，取点11,23,25确定髋关节角度。对于仰卧起坐，取点11，23，25确定髋关节角度，取点23，25，27确定膝盖弯曲角度。再对这些角度进行算法判断，从而完成对运动状态的判断。

 **2. 图片前后端的传输**
 由于前端采用的是小程序实现，后端采用的是Python进行姿态特征点的识别。摄像头采集的图像是从前端小程序采集的，因此需要将前端采集的图像传回后端利用Python进行识别预测，再将上述的各关节的角度返回给前端，在前端中撰写算法完成判断。
 因此，后端采用Flask接口实现。详细实现方式见flaskrun.py文件，将前端传回的图片保存在文件夹中，再对此图片进行Mediapipe特征点预测。
 
![image](https://github.com/Samuel-Pan/Human-Pose-Recognition-AI-Fitness-System/assets/156978136/6f73c7e0-76b8-4a2b-9915-e3a9e088ff58)

**3. 数据库设计**
在小程序中存储了历史运动数据，采用微信云平台作为数据库，设计了三张表，分别是用户user，俯卧撑sportRecord和仰卧起坐situp。在用户表中创建了openid，头像和昵称的属性，用来存储用户的数据，身高和体重属性则存储对应用户的身高和体重。在俯卧撑表中创建了五个属性，分别为运动的结束，正确的个数以及三处错误情况的计数。仰卧起坐表亦如此，创建了四个属性存储对应的仰卧起坐数据。

![image](https://github.com/Samuel-Pan/Human-Pose-Recognition-AI-Fitness-System/assets/156978136/89b5b6a5-9aec-4bb4-a51d-733981246b42)

目前小程序中提供了两种运动模式，分别是俯卧撑和仰卧起坐。也许后续会继续更新新的运动，也有可能不再更新。希望能给大家提供帮助。
