"use client"
import { useEffect, useRef } from "react"

function SplashCursor({
  // Add whatever props you like for customization
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
}) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const extRef = useRef(null)
  const configRef = useRef({
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    PAUSED: false,
    BACK_COLOR,
    TRANSPARENT,
  })
  const pointersRef = useRef([{}])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function pointerPrototype() {
      this.id = -1
      this.texcoordX = 0
      this.texcoordY = 0
      this.prevTexcoordX = 0
      this.prevTexcoordY = 0
      this.deltaX = 0
      this.deltaY = 0
      this.down = false
      this.moved = false
      this.color = [0, 0, 0]
    }

    pointersRef.current[0] = new pointerPrototype()

    const { gl, ext } = getWebGLContext(canvas)
    glRef.current = gl
    extRef.current = ext
    if (!ext.supportLinearFiltering) {
      configRef.current.DYE_RESOLUTION = 256
      configRef.current.SHADING = false
    }

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      }
      let gl = canvas.getContext("webgl2", params)
      const isWebGL2 = !!gl
      if (!isWebGL2) gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)
      let halfFloat
      let supportLinearFiltering
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float")
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear")
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float")
        supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear")
      }
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES
      let formatRGBA
      let formatRG
      let formatR

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      }
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
          default:
            return null
        }
      }
      return {
        internalFormat,
        format,
      }
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
      return status === gl.FRAMEBUFFER_COMPLETE
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader
        this.fragmentShaderSource = fragmentShaderSource
        this.programs = []
        this.activeProgram = null
        this.uniforms = []
      }
      setKeywords(keywords) {
        let hash = 0
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i])
        let program = this.programs[hash]
        if (program == null) {
          const fragmentShader = compileShader(glRef.current.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)
          program = createProgram(this.vertexShader, fragmentShader)
          this.programs[hash] = program
        }
        if (program === this.activeProgram) return
        this.uniforms = getUniforms(program)
        this.activeProgram = program
      }
      bind() {
        glRef.current.useProgram(this.activeProgram)
      }
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {}
        this.program = createProgram(vertexShader, fragmentShader)
        this.uniforms = getUniforms(this.program)
      }

      bind() {
        glRef.current.useProgram(this.program)
      }
    }

    function createProgram(vertexShader, fragmentShader) {
      const program = glRef.current.createProgram()
      glRef.current.attachShader(program, vertexShader)
      glRef.current.attachShader(program, fragmentShader)
      glRef.current.linkProgram(program)
      if (!glRef.current.getProgramParameter(program, glRef.current.LINK_STATUS))
        console.trace(glRef.current.getProgramInfoLog(program))
      return program
    }

    function getUniforms(program) {
      const uniforms = []
      const uniformCount = glRef.current.getProgramParameter(program, glRef.current.ACTIVE_UNIFORMS)
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = glRef.current.getActiveUniform(program, i).name
        uniforms[uniformName] = glRef.current.getUniformLocation(program, uniformName)
      }
      return uniforms
    }

    function compileShader(type, source, keywords) {
      source = addKeywords(source, keywords)
      const shader = glRef.current.createShader(type)
      glRef.current.shaderSource(shader, source)
      glRef.current.compileShader(shader)
      if (!glRef.current.getShaderParameter(shader, glRef.current.COMPILE_STATUS))
        console.trace(glRef.current.getShaderInfoLog(shader))
      return shader
    }

    function addKeywords(source, keywords) {
      if (!keywords) return source
      let keywordsString = ""
      keywords.forEach((keyword) => {
        keywordsString += "#define " + keyword + "\n"
      })
      return keywordsString + source
    }

    const baseVertexShader = compileShader(
      glRef.current.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,
    )

    const copyShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `,
    )

    const clearShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
     `,
    )

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `

    const splatShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `,
    )

    const advectionShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      extRef.current.supportLinearFiltering ? null : ["MANUAL_FILTERING"],
    )

    const divergenceShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
    )

    const curlShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
    )

    const vorticityShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    )

    const pressureShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
    )

    const gradientSubtractShader = compileShader(
      glRef.current.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    )

    const blit = (() => {
      glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, glRef.current.createBuffer())
      glRef.current.bufferData(
        glRef.current.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        glRef.current.STATIC_DRAW,
      )
      glRef.current.bindBuffer(glRef.current.ELEMENT_ARRAY_BUFFER, glRef.current.createBuffer())
      glRef.current.bufferData(
        glRef.current.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        glRef.current.STATIC_DRAW,
      )
      glRef.current.vertexAttribPointer(0, 2, glRef.current.FLOAT, false, 0, 0)
      glRef.current.enableVertexAttribArray(0)
      return (target, clear = false) => {
        if (target == null) {
          glRef.current.viewport(0, 0, glRef.current.drawingBufferWidth, glRef.current.drawingBufferHeight)
          glRef.current.bindFramebuffer(glRef.current.FRAMEBUFFER, null)
        } else {
          glRef.current.viewport(0, 0, target.width, target.height)
          glRef.current.bindFramebuffer(glRef.current.FRAMEBUFFER, target.fbo)
        }
        if (clear) {
          glRef.current.clearColor(0.0, 0.0, 0.0, 1.0)
          glRef.current.clear(glRef.current.COLOR_BUFFER_BIT)
        }
        glRef.current.drawElements(glRef.current.TRIANGLES, 6, glRef.current.UNSIGNED_SHORT, 0)
      }
    })()

    let dye, velocity, divergence, curl, pressure

    const copyProgram = new Program(baseVertexShader, copyShader)
    const clearProgram = new Program(baseVertexShader, clearShader)
    const splatProgram = new Program(baseVertexShader, splatShader)
    const advectionProgram = new Program(baseVertexShader, advectionShader)
    const divergenceProgram = new Program(baseVertexShader, divergenceShader)
    const curlProgram = new Program(baseVertexShader, curlShader)
    const vorticityProgram = new Program(baseVertexShader, vorticityShader)
    const pressureProgram = new Program(baseVertexShader, pressureShader)
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader)
    const displayMaterial = new Material(baseVertexShader, displayShaderSource)

    function initFramebuffers() {
      const simRes = getResolution(configRef.current.SIM_RESOLUTION)
      const dyeRes = getResolution(configRef.current.DYE_RESOLUTION)
      const texType = extRef.current.halfFloatTexType
      const rgba = extRef.current.formatRGBA
      const rg = extRef.current.formatRG
      const r = extRef.current.formatR
      const filtering = extRef.current.supportLinearFiltering ? glRef.current.LINEAR : glRef.current.NEAREST
      glRef.current.disable(glRef.current.BLEND)

      if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
      else dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)

      if (!velocity)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering,
        )

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, glRef.current.NEAREST)
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, glRef.current.NEAREST)
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        glRef.current.NEAREST,
      )
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      glRef.current.activeTexture(glRef.current.TEXTURE0)
      const texture = glRef.current.createTexture()
      glRef.current.bindTexture(glRef.current.TEXTURE_2D, texture)
      glRef.current.texParameteri(glRef.current.TEXTURE_2D, glRef.current.TEXTURE_MIN_FILTER, param)
      glRef.current.texParameteri(glRef.current.TEXTURE_2D, glRef.current.TEXTURE_MAG_FILTER, param)
      glRef.current.texParameteri(glRef.current.TEXTURE_2D, glRef.current.TEXTURE_WRAP_S, glRef.current.CLAMP_TO_EDGE)
      glRef.current.texParameteri(glRef.current.TEXTURE_2D, glRef.current.TEXTURE_WRAP_T, glRef.current.CLAMP_TO_EDGE)
      glRef.current.texImage2D(glRef.current.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

      const fbo = glRef.current.createFramebuffer()
      glRef.current.bindFramebuffer(glRef.current.FRAMEBUFFER, fbo)
      glRef.current.framebufferTexture2D(
        glRef.current.FRAMEBUFFER,
        glRef.current.COLOR_ATTACHMENT0,
        glRef.current.TEXTURE_2D,
        texture,
        0,
      )
      glRef.current.viewport(0, 0, w, h)
      glRef.current.clear(glRef.current.COLOR_BUFFER_BIT)

      const texelSizeX = 1.0 / w
      const texelSizeY = 1.0 / h
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          glRef.current.activeTexture(glRef.current.TEXTURE0 + id)
          glRef.current.bindTexture(glRef.current.TEXTURE_2D, texture)
          return id
        },
      }
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1
        },
        set read(value) {
          fbo1 = value
        },
        get write() {
          return fbo2
        },
        set write(value) {
          fbo2 = value
        },
        swap() {
          const temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        },
      }
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param)
      copyProgram.bind()
      glRef.current.uniform1i(copyProgram.uniforms.uTexture, target.attach(0))
      blit(newFBO)
      return newFBO
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width === w && target.height === h) return target
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param)
      target.write = createFBO(w, h, internalFormat, format, type, param)
      target.width = w
      target.height = h
      target.texelSizeX = 1.0 / w
      target.texelSizeY = 1.0 / h
      return target
    }

    function updateKeywords() {
      const displayKeywords = []
      if (configRef.current.SHADING) displayKeywords.push("SHADING")
      displayMaterial.setKeywords(displayKeywords)
    }

    updateKeywords()
    initFramebuffers()
    let lastUpdateTime = Date.now()
    let colorUpdateTimer = 0.0

    function updateFrame() {
      const dt = calcDeltaTime()
      if (resizeCanvas()) initFramebuffers()
      updateColors(dt)
      applyInputs()
      step(dt)
      render(null)
      requestAnimationFrame(updateFrame)
    }

    function calcDeltaTime() {
      const now = Date.now()
      let dt = (now - lastUpdateTime) / 1000
      dt = Math.min(dt, 0.016666)
      lastUpdateTime = now
      return dt
    }

    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas.clientWidth)
      const height = scaleByPixelRatio(canvas.clientHeight)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true
      }
      return false
    }

    function updateColors(dt) {
      colorUpdateTimer += dt * configRef.current.COLOR_UPDATE_SPEED
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
        pointersRef.current.forEach((p) => {
          p.color = generateColor()
        })
      }
    }

    function applyInputs() {
      pointersRef.current.forEach((p) => {
        if (p.moved) {
          p.moved = false
          splatPointer(p)
        }
      })
    }

    function step(dt) {
      glRef.current.disable(glRef.current.BLEND)
      // Curl
      curlProgram.bind()
      glRef.current.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      glRef.current.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(curl)

      // Vorticity
      vorticityProgram.bind()
      glRef.current.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      glRef.current.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      glRef.current.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
      glRef.current.uniform1f(vorticityProgram.uniforms.curl, configRef.current.CURL)
      glRef.current.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(velocity.write)
      velocity.swap()

      // Divergence
      divergenceProgram.bind()
      glRef.current.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      glRef.current.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergence)

      // Clear pressure
      clearProgram.bind()
      glRef.current.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      glRef.current.uniform1f(clearProgram.uniforms.value, configRef.current.PRESSURE)
      blit(pressure.write)
      pressure.swap()

      // Pressure
      pressureProgram.bind()
      glRef.current.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      glRef.current.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < configRef.current.PRESSURE_ITERATIONS; i++) {
        glRef.current.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
        blit(pressure.write)
        pressure.swap()
      }

      // Gradient Subtract
      gradienSubtractProgram.bind()
      glRef.current.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      glRef.current.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
      glRef.current.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()

      // Advection
      advectionProgram.bind()
      glRef.current.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      if (!extRef.current.supportLinearFiltering)
        glRef.current.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      const velocityId = velocity.read.attach(0)
      glRef.current.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
      glRef.current.uniform1i(advectionProgram.uniforms.uSource, velocityId)
      glRef.current.uniform1f(advectionProgram.uniforms.dt, dt)
      glRef.current.uniform1f(advectionProgram.uniforms.dissipation, configRef.current.VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()

      if (!extRef.current.supportLinearFiltering)
        glRef.current.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
      glRef.current.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      glRef.current.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
      glRef.current.uniform1f(advectionProgram.uniforms.dissipation, configRef.current.DENSITY_DISSIPATION)
      blit(dye.write)
      dye.swap()
    }

    function render(target) {
      glRef.current.blendFunc(glRef.current.ONE, glRef.current.ONE_MINUS_SRC_ALPHA)
      glRef.current.enable(glRef.current.BLEND)
      drawDisplay(target)
    }

    function drawDisplay(target) {
      const width = target == null ? glRef.current.drawingBufferWidth : target.width
      const height = target == null ? glRef.current.drawingBufferHeight : target.height
      displayMaterial.bind()
      if (configRef.current.SHADING)
        glRef.current.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height)
      glRef.current.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0))
      blit(target)
    }

    function splatPointer(pointer) {
      const dx = pointer.deltaX * configRef.current.SPLAT_FORCE
      const dy = pointer.deltaY * configRef.current.SPLAT_FORCE
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
    }

    function clickSplat(pointer) {
      const color = generateColor()
      color.r *= 10.0
      color.g *= 10.0
      color.b *= 10.0
      const dx = 10 * (Math.random() - 0.5)
      const dy = 30 * (Math.random() - 0.5)
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color)
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind()
      glRef.current.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      glRef.current.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
      glRef.current.uniform2f(splatProgram.uniforms.point, x, y)
      glRef.current.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0)
      glRef.current.uniform1f(splatProgram.uniforms.radius, correctRadius(configRef.current.SPLAT_RADIUS / 100.0))
      blit(velocity.write)
      velocity.swap()

      glRef.current.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
      glRef.current.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(dye.write)
      dye.swap()
    }

    function correctRadius(radius) {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio > 1) radius *= aspectRatio
      return radius
    }

    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id
      pointer.down = true
      pointer.moved = false
      pointer.texcoordX = posX / canvas.width
      pointer.texcoordY = 1.0 - posY / canvas.height
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.deltaX = 0
      pointer.deltaY = 0
      pointer.color = generateColor()
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.texcoordX = posX / canvas.width
      pointer.texcoordY = 1.0 - posY / canvas.height
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
      pointer.color = color
    }

    function updatePointerUpData(pointer) {
      pointer.down = false
    }

    function correctDeltaX(delta) {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio < 1) delta *= aspectRatio
      return delta
    }

    function correctDeltaY(delta) {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio > 1) delta /= aspectRatio
      return delta
    }

    function generateColor() {
      // Define your primary color shades in RGB format (converted from oklch)
      const primaryColors = [
        { r: 0.95, g: 0.65, b: 0.15 }, // primary-lighter
        { r: 0.85, g: 0.55, b: 0.12 }, // primary-light
        { r: 0.75, g: 0.45, b: 0.1 }, // primary
        { r: 0.65, g: 0.35, b: 0.08 }, // primary-dark
        { r: 0.55, g: 0.25, b: 0.06 }, // primary-darker
      ]

      // Randomly select one of the primary color shades
      const selectedColor = primaryColors[Math.floor(Math.random() * primaryColors.length)]

      // Apply intensity variation for more dynamic effects
      const intensity = 0.8 + Math.random() * 0.4 // Random intensity between 0.8 and 1.2

      return {
        r: selectedColor.r * intensity,
        g: selectedColor.g * intensity,
        b: selectedColor.b * intensity,
      }
    }

    function HSVtoRGB(h, s, v) {
      let r, g, b, i, f, p, q, t
      i = Math.floor(h * 6)
      f = h * 6 - i
      p = v * (1 - s)
      q = v * (1 - f * s)
      t = v * (1 - (1 - f) * s)
      switch (i % 6) {
        case 0:
          r = v
          g = t
          b = p
          break
        case 1:
          r = q
          g = v
          b = p
          break
        case 2:
          r = p
          g = v
          b = t
          break
        case 3:
          r = p
          g = q
          b = v
          break
        case 4:
          r = t
          g = p
          b = v
          break
        case 5:
          r = v
          g = p
          b = q
          break
        default:
          break
      }
      return { r, g, b }
    }

    function wrap(value, min, max) {
      const range = max - min
      if (range === 0) return min
      return ((value - min) % range) + min
    }

    function getResolution(resolution) {
      let aspectRatio = glRef.current.drawingBufferWidth / glRef.current.drawingBufferHeight
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio
      const min = Math.round(resolution)
      const max = Math.round(resolution * aspectRatio)
      if (glRef.current.drawingBufferWidth > glRef.current.drawingBufferHeight) return { width: max, height: min }
      else return { width: min, height: max }
    }

    function scaleByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1
      return Math.floor(input * pixelRatio)
    }

    function hashCode(s) {
      if (s.length === 0) return 0
      let hash = 0
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i)
        hash |= 0
      }
      return hash
    }

    window.addEventListener("mousedown", (e) => {
      const pointer = pointersRef.current[0]
      const posX = scaleByPixelRatio(e.clientX)
      const posY = scaleByPixelRatio(e.clientY)
      updatePointerDownData(pointer, -1, posX, posY)
      clickSplat(pointer)
    })

    document.body.addEventListener("mousemove", function handleFirstMouseMove(e) {
      const pointer = pointersRef.current[0]
      const posX = scaleByPixelRatio(e.clientX)
      const posY = scaleByPixelRatio(e.clientY)
      const color = generateColor()
      updatePointerMoveData(pointer, posX, posY, color)
      document.body.removeEventListener("mousemove", handleFirstMouseMove)
    })

    window.addEventListener("mousemove", (e) => {
      const pointer = pointersRef.current[0]
      const posX = scaleByPixelRatio(e.clientX)
      const posY = scaleByPixelRatio(e.clientY)
      const color = pointer.color
      updatePointerMoveData(pointer, posX, posY, color)
    })

    document.body.addEventListener("touchstart", function handleFirstTouchStart(e) {
      const touches = e.targetTouches
      const pointer = pointersRef.current[0]
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX)
        const posY = scaleByPixelRatio(touches[i].clientY)
        updatePointerDownData(pointer, touches[i].identifier, posX, posY)
      }
      document.body.removeEventListener("touchstart", handleFirstTouchStart)
    })

    window.addEventListener("touchstart", (e) => {
      const touches = e.targetTouches
      const pointer = pointersRef.current[0]
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX)
        const posY = scaleByPixelRatio(touches[i].clientY)
        updatePointerDownData(pointer, touches[i].identifier, posX, posY)
      }
    })

    window.addEventListener(
      "touchmove",
      (e) => {
        const touches = e.targetTouches
        const pointer = pointersRef.current[0]
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX)
          const posY = scaleByPixelRatio(touches[i].clientY)
          updatePointerMoveData(pointer, posX, posY, pointer.color)
        }
      },
      false,
    )

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches
      const pointer = pointersRef.current[0]
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer)
      }
    })

    updateFrame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ])

  return (
    <div className="fixed top-0 left-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} id="fluid" className="w-screen h-screen" />
    </div>
  )
}

export { SplashCursor }
