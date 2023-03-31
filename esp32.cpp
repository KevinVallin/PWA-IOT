#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <vector>
#include <freertos/queue.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;

using namespace std;

struct Led {
  int pin;
  int start_time;
  int end_time;
  bool light_on;
};

int myPin[3] = {25, 26, 27};
vector<Led> leds;

bool start_led = false;

int date_time = -1;

unsigned long previousTime,previousTime1,previousTime2,previousTime3;

TaskHandle_t Task1;
TaskHandle_t Task2;
QueueHandle_t queue;

void allumer_une_led(String led) {
  digitalWrite(myPin[led.toInt()], HIGH);
}

void parse_msg(String msg) {
  
  for(int i = 0; i < msg.length(); i += 5) {

    Led led;
    
    int index = msg.substring(i, i+1).toInt() - 1;
    led.pin = myPin[index];
    
    led.start_time = msg.substring(i+1,i+3).toInt();
    led.end_time = msg.substring(i+3,i+5).toInt();
    led.light_on = false;

    leds.push_back(led);
    
    Serial.println(led.pin);
    Serial.println(led.start_time);
    Serial.println(led.end_time);

  }
  
}


void setup()
{

  for(byte i = 0; i < 3; i += 1) {
    pinMode(myPin[i], OUTPUT);
  }
  
  Serial.begin(115200);
  Serial.println("Starting BLE Server!");

  BLEDevice::init("ESP groupe 3");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  //pCharacteristic->setValue("Hello, World!");

  
  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  //BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  
  BLEDevice::startAdvertising();
  
  pAdvertising->start();
  
  Serial.println("Characteristic defined! Now you can read it in the Client!");

  //create a task on core 0 that will be execute task1Func() with priority 10
  xTaskCreatePinnedToCore(
                    handleMessages,   /* Task function. */
                    "Task1",     /* name of task. */
                    10000,       /* Stack size of task */
                    NULL,        /* parameter of the task */
                    10,           /* priority of the task */
                    &Task1,      /* Task handle to keep track of created task */
                    0);    

   //create a task on core 2 that will be execute task1Func() with priority 10
  xTaskCreatePinnedToCore(
                    blinckLed,   /* Task function. */
                    "Task2",     /* name of task. */
                    10000,       /* Stack size of task */
                    NULL,        /* parameter of the task */
                    10,           /* priority of the task */
                    &Task2,      /* Task handle to keep track of created task */
                    0);    
}

void handleMessages( void * pvParameters ){
  for(;;){
    std::string rxValue = pCharacteristic->getValue();

    if(!rxValue.empty()){
      Serial.print("value received = ");
      Serial.println(rxValue.c_str());
      parse_msg(rxValue.c_str());
      start_led = true;
      date_time = 0;
      pCharacteristic->setValue("");
    }

    delay(200);//vTaskDelay( pdMS_TO_TICKS( 200 ) );
  }
}

void blinckLed(void* pvParamaters) {
  for(;;){
    if(start_led){
      for(auto & led: leds) {
       if(led.start_time - date_time <= 0 && !led.light_on) {
          digitalWrite(led.pin, HIGH);
          led.light_on = true;
        }
        if(led.end_time - date_time <= 0 && led.light_on) {
          digitalWrite(led.pin, LOW);
          led.light_on = false;
        }
      }
      date_time += 1;
    }
    
    delay(100); 
  }
}


void loop()
{
  delay(500);
}
