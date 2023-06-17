let vsSource = `
    precision mediump float;
    precision mediump int;
	attribute vec3 vertPosition;
	attribute vec3 vertNormales;
	attribute vec2 vertTexCoord;
	attribute vec2 vertTexCoord2;
	varying vec3 fragColor;
	varying vec2 fragTexCoord;
	varying vec2 fragTexCoord2;

	uniform vec3 uColors;
	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;
	
	uniform float Ka;
	uniform float Kd;
	uniform float Ks;
	uniform vec3 lightPos;
	uniform float shininess;
	
	uniform vec3 ambientColor;
	uniform vec3 diffuseColor;
	uniform vec3 specularColor;
	
	//Modes
	uniform int shadingMode;
	uniform int lightModelMode;
	
	varying vec3 surfWorldPos;
	varying vec3 surfToLight;
	varying vec3 normal;
	varying vec3 surfToView;
	
	void main()
	{
	    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
	    fragColor = uColors;
	    fragTexCoord = vertTexCoord;
	    fragTexCoord2 = vertTexCoord2;
	
	    surfWorldPos = (mWorld * vec4(vertPosition, 1.0)).xyz;
	    surfToLight = normalize(lightPos - surfWorldPos);
	    normal = vec3(mWorld * vec4(vertNormales, 0.0));
	    surfToView = normalize(vec3(0.0, -1.0, 0.0) - surfWorldPos);
	
	    //Если Фонг, уходим во фрагментный
	    if (shadingMode != 0)
	        return;
	
        vec3 halfVector = normalize(surfToLight + surfToView);
        vec3 reflectDir = reflect(-surfToLight, normal);
        float specular = 0.0;
        float diffuse = max(dot(normal, surfToLight), 0.0);
        if (diffuse > 0.0) {
            specular = pow(max(dot(surfToView, reflectDir), 0.0), shininess);
        }
        if (lightModelMode == 0) {
            fragColor = Kd * diffuse * diffuseColor * uColors;
        } else {
	        fragColor = Ka * ambientColor + Kd * diffuse * diffuseColor * uColors + Ks * specular * specularColor;
	    }
	}`;

let fsSource = `
    precision mediump float;
    precision mediump int;
	varying vec3 fragColor;
	varying vec2 fragTexCoord;
	varying vec2 fragTexCoord2;
    uniform sampler2D uTexture;
    uniform sampler2D uTexture2;
    uniform float texMixer;
    
    uniform float Ka;
	uniform float Kd;
	uniform float Ks;
	uniform float shininess;
	uniform float lightPower;
	
	uniform vec3 ambientColor;
	uniform vec3 diffuseColor;
	uniform vec3 specularColor;
    
    //Modes
	uniform int shadingMode;
	uniform int lightModelMode;
	
	varying vec3 surfWorldPos;
	varying vec3 surfToLight;
	varying vec3 normal;
	varying vec3 surfToView;
    
	
	void main()
	{
		vec4 textureColor = texture2D(uTexture, fragTexCoord);
		vec4 textureColor2 = texture2D(uTexture2, fragTexCoord2);
		
		vec3 resultColor = fragColor;
		
        if (shadingMode == 0) {
            gl_FragColor = mix(textureColor, textureColor2, texMixer) * vec4(fragColor, 1.0);
        } else {
            vec3 n_normal = normalize(normal);
            vec3 n_surfToLight = normalize(surfToLight);
            vec3 n_surfToView = normalize(surfToView);
            vec3 halfVector = normalize(n_surfToLight + n_surfToView);
            vec3 reflectDir = reflect(-n_surfToLight, n_normal);
            float specular = 0.0;
            float diffuse = max(dot(n_normal, n_surfToLight), 1.0);
            if (diffuse > 0.0) {
                specular = pow(max(dot(n_surfToView, reflectDir), 0.0), shininess);
            }
            
            if (lightModelMode == 0) { 
                resultColor = Kd * diffuse * diffuseColor * fragColor; 
            } else {
                resultColor = Ka * ambientColor + Kd * diffuse * diffuseColor * fragColor + Ks * specular * specularColor;
            }
        }
        gl_FragColor = mix(textureColor, textureColor2, texMixer) * vec4(resultColor, 1.0);
        gl_FragColor.rgb *= lightPower;
	}`;