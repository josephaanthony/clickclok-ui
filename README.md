npm install -g @ionic/cli

ionic serve

ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android

ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor open ios



ionic capacitor build android

ionic capacitor build android --release

ionic capacitor build android --debug --configuration production

keystore path: C:\Users\josep\DadyIn\Projects\keystore\clickclok.jks -> MyDrive/ClikClok
               E:\Users\josep\Documents\Crypto\clikclok.jks  -> Desktop

keytool -list -v -keystore C:\Users\josep\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
18:0A:01:BA:B5:27:23:D1:E1:CC:64:95:41:A7:27:C7:E7:47:94:77

E:\Users\josep\Documents\Crypto\clickclok-ui\android\app


java -jar "E:\Users\josep\Downloads\pepk.jar" --keystore="E:\Users\josep\Documents\Crypto\clikclok.jks" --alias=androidclikclokkey --output=output.zip --include-cert --rsa-aes-encryption --encryption-key-path="E:\Users\josep\Downloads\encryption_public_key.pem"


keytool -list -v -keystore E:\Users\josep\Documents\Crypto\clikclok.jks -alias androidclikclokkey -storepass jTony123 -keypass jTony123
9E:F7:F2:4A:86:57:6E:03:35:84:AA:A0:43:1E:AC:83:63:CA:01:E3