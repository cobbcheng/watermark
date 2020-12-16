const WATERMARK = 'watermark'

export default class Watermark {
  container: HTMLElement = document.body
  width = 200
  height = 200
  textAlign: CanvasTextAlign = 'center'
  textBaseline: CanvasTextBaseline = 'middle'
  font = '16px bold'
  fillStyle = 'rgba(184, 184, 184, 0.1)'
  content = '仅限内部'
  rotate = 340
  zIndex = 1000

  private watermarkDiv: HTMLElement
  private mo: MutationObserver
  private styles: string

  constructor() {
    this.mo = new window.MutationObserver(() => {
      const dom = document.getElementById(WATERMARK)
      if (
        !dom ||
        dom.getAttribute('style') !== this.styles ||
        dom.classList.length > 0
      ) {
        this.remove()
        this.generate()
      }
    })
  }

  generate() {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')!

    ctx.textAlign = this.textAlign
    ctx.textBaseline = this.textBaseline
    ctx.font = this.font
    ctx.fillStyle = this.fillStyle
    ctx.rotate((Math.PI / 180) * this.rotate)
    ctx.fillText(this.content, this.width / 2, this.height / 2)

    const dom = document.getElementById(WATERMARK)
    this.watermarkDiv = dom || document.createElement('div')

    this.styles = `
      position:fixed;
      top:0;
      left:0;
      width:100vw;
      height:100vh;
      z-index:${this.zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-image:url('${canvas.toDataURL()}');
    `
    this.watermarkDiv.setAttribute('style', this.styles)
    this.watermarkDiv.setAttribute('id', WATERMARK)

    if (!dom) {
      const c = this.container
      c.style.position = 'relative'
      c.append(this.watermarkDiv, c.firstChild!)
    }

    this.mo.observe(this.container, {
      attributes: true,
      subtree: true,
      childList: true
    })
  }

  remove() {
    if (this.mo) {
      this.mo.disconnect()
      // this.#mo = null
    }

    const el = this.watermarkDiv
    el && el.remove()
  }
}
