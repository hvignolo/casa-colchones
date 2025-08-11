import React, { useState, useRef, useEffect } from 'react'
// Iconos para mejorar la interfaz
import { FilePlus, Save, BookOpen, Trash2 } from 'lucide-react'

// Tipos de estilos disponibles
export type EstiloCartola =
  | 'modern'
  | 'original'
  | 'minimal'
  | 'gradient'
  | 'dark'
  | 'geometric'
  | 'wellness'
  | 'sale'
  | 'delicate'

// Mapa de etiquetas visibles para cada estilo
const ETIQUETAS_ESTILOS: Record<EstiloCartola, string> = {
  modern: 'Modern',
  original: 'Original',
  minimal: 'Minimal',
  gradient: 'Gradiente',
  dark: 'Oscuro',
  geometric: 'Geométrico',
  wellness: 'Bienestar',
  sale: 'Oferta',
  delicate: 'Delicado',
}

// Mapa de colores para los degradados de fondo
const ESTILOS_COLORES: Record<EstiloCartola, [string, string]> = {
  modern: ['#667eea', '#764ba2'],
  original: ['#3b82f6', '#1e40af'],
  minimal: ['#f8fafc', '#f1f5f9'],
  gradient: ['#ec4899', '#f43f5e'],
  dark: ['#111827', '#1f2937'],
  geometric: ['#0ea5e9', '#0284c7'],
  wellness: ['#34d399', '#059669'],
  sale: ['#f87171', '#dc2626'],
  delicate: ['#fbcfe8', '#f9a8d4'],
}

// Estado interno que representa todos los campos de texto de la cartola
interface CartolaData {
  titulo: string
  oferta: string
  producto: string
  precioActual: string
  precioAnterior: string
  caracteristica1: string
  caracteristica2: string
  caracteristica3: string
  mensajeFinal: string
}

// Estilo individual para cada campo
interface FieldStyle {
  bold: boolean
  color: string
  spacing: number
  fontSize: number
}

// Conjunto de estilos para todos los campos de la cartola
type CartolaStyles = {
  [K in keyof CartolaData]: FieldStyle
}

// Representa una cartola guardada, con sus datos y estilos asociados
interface SavedCartola {
  data: CartolaData
  estilo: EstiloCartola
  styles: CartolaStyles
  name: string
}

// Datos precargados que puede recibir el modal
interface CartolaPreloadData {
  data: CartolaData
  estilo: EstiloCartola
  styles?: CartolaStyles
}

/**
 * Propiedades para el modal de cartola
 */
export interface CartolaModalProps {
  open: boolean
  onClose: () => void
  preloadData?: CartolaPreloadData
}

// Componente principal
const CartolaModal: React.FC<CartolaModalProps> = ({ open, onClose, preloadData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Datos editables de la cartola
  const [data, setData] = useState<CartolaData>({
    titulo: 'REPOSAR',
    oferta: 'OFERTA HASTA FIN DE MES',
    producto: 'COLCHÓN + SOMMIER\n1 PLAZA',
    precioActual: '$296.800,00',
    precioAnterior: '$348.552,00',
    caracteristica1: 'Resortes en Malla',
    caracteristica2: 'Sommier Estructura Madera',
    caracteristica3: 'Medidas: 100x190x25 cm',
    mensajeFinal: 'Aprovechá y renová tu cama!',
  })

  // Estilo seleccionado
  const [estilo, setEstilo] = useState<EstiloCartola>('modern')

  // Estilos individuales para cada campo (negrita, color y espaciado)
  const [styles, setStyles] = useState<CartolaStyles>({
    titulo: { bold: true, color: '', spacing: 20, fontSize: 64 },
    oferta: { bold: false, color: '', spacing: 20, fontSize: 32 },
    producto: { bold: false, color: '', spacing: 20, fontSize: 32 },
    precioActual: { bold: true, color: '', spacing: 40, fontSize: 56 },
    precioAnterior: { bold: false, color: '', spacing: 20, fontSize: 24 },
    caracteristica1: { bold: false, color: '', spacing: 10, fontSize: 28 },
    caracteristica2: { bold: false, color: '', spacing: 10, fontSize: 28 },
    caracteristica3: { bold: false, color: '', spacing: 10, fontSize: 28 },
    mensajeFinal: { bold: false, color: '', spacing: 20, fontSize: 32 },
  })

  // Lista de cartolas guardadas en el almacenamiento local
  const [savedCartolas, setSavedCartolas] = useState<SavedCartola[]>([])

  // Nombre temporal para la cartola al guardar
  const [templateName, setTemplateName] = useState('')

  // Efecto para cargar datos precargados
  useEffect(() => {
    if (preloadData && open) {
      setData(preloadData.data);
      setEstilo(preloadData.estilo);
      
      if (preloadData.styles) {
        setStyles(preloadData.styles);
      } else {
        // Usar estilos por defecto si no se proporcionan
        setStyles({
          titulo: { bold: true, color: '', spacing: 20, fontSize: 64 },
          oferta: { bold: false, color: '', spacing: 20, fontSize: 32 },
          producto: { bold: false, color: '', spacing: 20, fontSize: 32 },
          precioActual: { bold: true, color: '', spacing: 40, fontSize: 56 },
          precioAnterior: { bold: false, color: '', spacing: 20, fontSize: 24 },
          caracteristica1: { bold: false, color: '', spacing: 10, fontSize: 28 },
          caracteristica2: { bold: false, color: '', spacing: 10, fontSize: 28 },
          caracteristica3: { bold: false, color: '', spacing: 10, fontSize: 28 },
          mensajeFinal: { bold: false, color: '', spacing: 20, fontSize: 32 },
        });
      }
    }
  }, [preloadData, open]);

  // Carga plantillas guardadas al abrir el modal
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('savedCartolas')
      if (stored) {
        try {
          setSavedCartolas(JSON.parse(stored) as SavedCartola[])
        } catch (err) {
          console.error('Error al cargar plantillas guardadas', err)
        }
      }
    }
  }, [open])

  // Actualiza un atributo de estilo (bold, color o spacing) para un campo concreto
  const updateStyle = (
    field: keyof CartolaData,
    attr: keyof FieldStyle,
    value: any,
  ) => {
    setStyles((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [attr]: value,
      },
    }))
  }

  // Alterna la negrita de un campo
  const toggleBold = (field: keyof CartolaData) => {
    setStyles((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        bold: !prev[field].bold,
      },
    }))
  }

  // Guarda la cartola actual en el almacenamiento local
  const saveCurrentCartola = () => {
    const trimmed = templateName.trim()
    const name = trimmed || data.titulo || `Cartola ${savedCartolas.length + 1}`
    const nueva: SavedCartola = {
      data: { ...data },
      estilo,
      styles: { ...styles },
      name,
    }
    const updated = [...savedCartolas, nueva]
    setSavedCartolas(updated)
    localStorage.setItem('savedCartolas', JSON.stringify(updated))
    setTemplateName('')
  }

  // Carga una cartola guardada
  const loadSavedCartola = (index: number) => {
    const plantilla = savedCartolas[index]
    if (!plantilla) return
    setData(plantilla.data)
    setEstilo(plantilla.estilo)
    setStyles((prev) => {
      const defaults: CartolaStyles = {
        titulo: { bold: true, color: '', spacing: 20, fontSize: 64 },
        oferta: { bold: false, color: '', spacing: 20, fontSize: 32 },
        producto: { bold: false, color: '', spacing: 20, fontSize: 32 },
        precioActual: { bold: true, color: '', spacing: 40, fontSize: 56 },
        precioAnterior: { bold: false, color: '', spacing: 20, fontSize: 24 },
        caracteristica1: { bold: false, color: '', spacing: 10, fontSize: 28 },
        caracteristica2: { bold: false, color: '', spacing: 10, fontSize: 28 },
        caracteristica3: { bold: false, color: '', spacing: 10, fontSize: 28 },
        mensajeFinal: { bold: false, color: '', spacing: 20, fontSize: 32 },
      }
      const newStyles = { ...defaults }
      ;(Object.keys(plantilla.styles) as (keyof CartolaData)[]).forEach((key) => {
        newStyles[key] = { ...defaults[key], ...plantilla.styles[key] }
      })
      return newStyles
    })
  }

  // Elimina una cartola guardada
  const deleteSavedCartola = (index: number) => {
    const filtered = savedCartolas.filter((_, i) => i !== index)
    setSavedCartolas(filtered)
    localStorage.setItem('savedCartolas', JSON.stringify(filtered))
  }

  // Ejemplos predefinidos de cartolas
  const exampleCartolas: SavedCartola[] = [
    {
      name: 'Ejemplo Oferta',
      data: {
        titulo: 'SUPERCOLCHÓN',
        oferta: 'OFERTA IMPERDIBLE',
        producto: 'COLCHÓN PREMIUM\n2 PLAZAS',
        precioActual: '$450.000,00',
        precioAnterior: '$620.000,00',
        caracteristica1: 'Resortes Pocket',
        caracteristica2: 'Sommier Roble',
        caracteristica3: 'Medidas: 160x200x30 cm',
        mensajeFinal: '¡Dormí como nunca!'
      },
      estilo: 'sale',
      styles: {
        titulo: { bold: true, color: '', spacing: 20, fontSize: 64 },
        oferta: { bold: true, color: '', spacing: 20, fontSize: 32 },
        producto: { bold: false, color: '', spacing: 20, fontSize: 32 },
        precioActual: { bold: true, color: '', spacing: 40, fontSize: 56 },
        precioAnterior: { bold: false, color: '', spacing: 20, fontSize: 24 },
        caracteristica1: { bold: false, color: '', spacing: 10, fontSize: 28 },
        caracteristica2: { bold: false, color: '', spacing: 10, fontSize: 28 },
        caracteristica3: { bold: false, color: '', spacing: 10, fontSize: 28 },
        mensajeFinal: { bold: false, color: '', spacing: 20, fontSize: 32 },
      },
    },
  ]

  // Aplica el primer ejemplo predefinido
  const applyExample = () => {
    const ejemplo = exampleCartolas[0]
    setData(ejemplo.data)
    setEstilo(ejemplo.estilo)
    setStyles(ejemplo.styles)
  }

  // Configuración de los campos para generar los controles dinámicamente
  const fieldConfigs: { field: keyof CartolaData; label: string; textarea?: boolean; rows?: number; placeholder: string }[] = [
    { field: 'titulo', label: 'Título principal', placeholder: 'Ej: REPOSAR' },
    { field: 'oferta', label: 'Texto de oferta', placeholder: 'Ej: OFERTA HASTA FIN DE MES' },
    { field: 'producto', label: 'Descripción del producto (usa Enter para nueva línea)', textarea: true, rows: 3, placeholder: 'Ej: COLCHÓN + SOMMIER\n1 PLAZA' },
    { field: 'precioActual', label: 'Precio actual', placeholder: 'Ej: $296.800,00' },
    { field: 'precioAnterior', label: 'Precio anterior', placeholder: 'Ej: $348.552,00' },
    { field: 'caracteristica1', label: 'Característica 1', placeholder: 'Ej: Resortes en Malla' },
    { field: 'caracteristica2', label: 'Característica 2', placeholder: 'Ej: Sommier Estructura Madera' },
    { field: 'caracteristica3', label: 'Característica 3', placeholder: 'Ej: Medidas: 100x190x25 cm' },
    { field: 'mensajeFinal', label: 'Mensaje final (usa Enter para nueva línea)', textarea: true, rows: 2, placeholder: 'Ej: Aprovechá y renová tu cama!' },
  ]

  // Maneja cambios de cualquiera de los campos de texto
  const updateField = (field: keyof CartolaData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  // Dibuja la cartola en el canvas cada vez que cambian los datos
  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawCartola(ctx, canvas, data, estilo, styles)
  }, [data, estilo, styles, open])

  // Genera un nombre de fichero basado en el título y la fecha actual
  const generateFileName = (): string => {
    const base = data.titulo || 'cartola'
    const fecha = new Date()
    const dateStr = fecha.toLocaleDateString('es-AR').replace(/\//g, '-')
    const timeStr = fecha
      .toLocaleTimeString('es-AR', { hour12: false })
      .replace(/:/g, '-')
    return `${base.replace(/\s+/g, '_')}_${dateStr}_${timeStr}.png`
  }

  // Descarga la imagen del lienzo como un PNG
  const downloadCartola = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = generateFileName()
    link.click()
  }

  // No renderizar nada si el modal no está abierto
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
    >
      <div
        className="bg-gray-100 rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera degradada */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-t-lg">
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <FilePlus className="w-5 h-5" />
            Editor de Cartola
            {preloadData && (
              <span className="text-sm bg-white/20 px-2 py-1 rounded-md">
                Datos del producto cargados
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-xl font-bold hover:text-gray-200"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {/* Contenido principal */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna de configuración de textos y estilos */}
          <div className="space-y-6">
            {/* Selector de estilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estilo de Cartola
              </label>
              <select
                value={estilo}
                onChange={(e) => setEstilo(e.target.value as EstiloCartola)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 text-gray-800 px-3 py-2"
              >
                {Object.keys(ETIQUETAS_ESTILOS).map((key) => (
                  <option key={key} value={key}>
                    {ETIQUETAS_ESTILOS[key as EstiloCartola]}
                  </option>
                ))}
              </select>
            </div>
            {/* Plantillas guardadas */}
            <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Plantillas Guardadas</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Nombre..."
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-800 w-32"
                  />
                  <button
                    onClick={saveCurrentCartola}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    title="Guardar plantilla"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                  <button
                    onClick={applyExample}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
                    title="Cargar ejemplo"
                  >
                    <BookOpen className="w-4 h-4" /> Ejemplo
                  </button>
                </div>
              </div>
              {savedCartolas.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedCartolas.map((plantilla, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-green-100 py-1">
                      <span className="text-sm text-gray-700 truncate">
                        {plantilla.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadSavedCartola(idx)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Usar
                        </button>
                        <button
                          onClick={() => deleteSavedCartola(idx)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay plantillas guardadas.</p>
              )}
            </div>
            {/* Campos dinámicos con controles de estilo */}
            {fieldConfigs.map(({ field, label, textarea, rows, placeholder }) => (
              <div key={field as string} className="bg-white rounded-md p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                {textarea ? (
                  <textarea
                    value={data[field] as any}
                    onChange={(e) => updateField(field, e.target.value)}
                    rows={rows}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 text-gray-800 px-3 py-2"
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={data[field] as any}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 text-gray-800 px-3 py-2"
                    placeholder={placeholder}
                  />
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {/* Botón de negrita */}
                  <button
                    onClick={() => toggleBold(field)}
                    className={`px-2 py-1 border rounded text-sm ${styles[field].bold ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                    title="Negrita"
                  >
                    B
                  </button>
                  {/* Selector de color */}
                  <input
                    type="color"
                    value={styles[field].color}
                    onChange={(e) => updateStyle(field, 'color', e.target.value)}
                    className="w-8 h-8 border rounded"
                    title="Color del texto"
                  />
                  {/* Espaciado vertical */}
                  <input
                    type="number"
                    value={styles[field].spacing}
                    onChange={(e) => updateStyle(field, 'spacing', parseInt(e.target.value) || 0)}
                    className="w-16 text-xs border rounded px-1 py-0.5"
                    title="Espaciado (px)"
                  />
                  <span className="text-xs text-gray-500">px</span>
                  {/* Tamaño de fuente */}
                  <input
                    type="number"
                    value={styles[field].fontSize}
                    onChange={(e) => updateStyle(field, 'fontSize', parseInt(e.target.value) || 0)}
                    className="w-16 text-xs border rounded px-1 py-0.5"
                    title="Tamaño de letra (px)"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            ))}
          </div>
          {/* Columna de vista previa */}
          <div className="flex flex-col items-center justify-start gap-4">
            <canvas
              ref={canvasRef}
              width={900}
              height={1200}
              className="w-full max-w-[400px] border rounded-md shadow"
            />
            <button
              onClick={downloadCartola}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Descargar Cartola
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dibuja la cartola en un contexto de lienzo 2D
 */
function drawCartola(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: CartolaData,
  estilo: EstiloCartola,
  styles: CartolaStyles,
) {
  // Obtiene los colores del estilo
  const [colorInicio, colorFin] = ESTILOS_COLORES[estilo]

  // Fondo degradado vertical
  const fondo = ctx.createLinearGradient(0, 0, 0, canvas.height)
  fondo.addColorStop(0, colorInicio)
  fondo.addColorStop(1, colorFin)
  ctx.fillStyle = fondo
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Color de texto: claro para fondos oscuros y oscuro para fondos claros
  const textoClaro = isDark(colorInicio) || isDark(colorFin)
    ? '#ffffff'
    : '#1f2937'

  ctx.textAlign = 'center'

  // Título principal
  let y = 130
  if (data.titulo) {
    const st = styles.titulo
    ctx.fillStyle = st.color || textoClaro
    const fontSize = st.fontSize || 64
    ctx.font = `${st.bold ? 'bold ' : ''}${fontSize}px Arial`
    ctx.fillText(data.titulo, canvas.width / 2, y)
    y += fontSize + 16 + st.spacing
  }

  // Oferta: recuadro semitransparente
  if (data.oferta) {
    const st = styles.oferta
    const fontSize = st.fontSize || 32
    const ofertaX = 50
    const ofertaY = y - 20
    const ofertaW = canvas.width - 100
    const ofertaH = fontSize * 2.5
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    drawRoundedRect(ctx, ofertaX, ofertaY, ofertaW, ofertaH, 15)
    ctx.fill()
    ctx.fillStyle = st.color || textoClaro
    ctx.font = `${st.bold ? 'bold ' : ''}${fontSize}px Arial`
    const offerLineHeight = fontSize * 1.3
    drawTextWithLineBreaks(
      ctx,
      data.oferta,
      canvas.width / 2,
      ofertaY + ofertaH / 2 + fontSize * 0.3,
      offerLineHeight,
      ofertaW - 40,
    )
    y += ofertaH + 30 + st.spacing
  }

  // Producto
  if (data.producto) {
    const st = styles.producto
    ctx.fillStyle = st.color || textoClaro
    const fontSize = st.fontSize || 32
    ctx.font = `${st.bold ? 'bold ' : ''}${fontSize}px Arial`
    const lineHeight = fontSize * 1.3
    drawTextWithLineBreaks(
      ctx,
      data.producto,
      canvas.width / 2,
      y,
      lineHeight,
      canvas.width - 100,
    )
    const numLineas = data.producto.split('\n').length
    y += numLineas * lineHeight + fontSize + st.spacing
  }

  // Bloque de precio
  if (data.precioActual || data.precioAnterior) {
    const stAct = styles.precioActual
    const stPrev = styles.precioAnterior
    const precioX = 50
    const precioY = y
    const precioW = canvas.width - 100
    const priceFontSize = stAct.fontSize || 56
    const headerSize = Math.max(18, Math.round(priceFontSize * 0.5))
    const prevSize = stPrev.fontSize || 24
    const precioH = headerSize + priceFontSize + prevSize + 40
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    drawRoundedRect(ctx, precioX, precioY, precioW, precioH, 15)
    ctx.fill()
    let precioYCursor = precioY
    // Cabecera del precio
    ctx.fillStyle = stPrev.color || stAct.color || textoClaro
    ctx.font = `${stPrev.bold || stAct.bold ? 'bold ' : ''}${headerSize}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(
      data.precioAnterior ? 'PRECIO ESPECIAL' : 'PRECIO CONTADO',
      canvas.width / 2,
      precioYCursor + headerSize + 10,
    )
    precioYCursor += headerSize + 10
    // Precio actual
    if (data.precioActual) {
      ctx.fillStyle = stAct.color || textoClaro
      ctx.font = `${stAct.bold ? 'bold ' : ''}${priceFontSize}px Arial`
      ctx.fillText(
        data.precioActual,
        canvas.width / 2,
        precioYCursor + priceFontSize + 8,
      )
      precioYCursor += priceFontSize + 8
    }
    // Precio anterior
    if (data.precioAnterior) {
      ctx.fillStyle = stPrev.color || textoClaro
      ctx.font = `${stPrev.bold ? 'bold ' : ''}${prevSize}px Arial`
      ctx.fillText(
        `Antes: ${data.precioAnterior}`,
        canvas.width / 2,
        precioYCursor + prevSize + 8,
      )
      precioYCursor += prevSize + 8
    }
    y += precioH + 40 + stAct.spacing
  }

  // Lista de características
  ctx.textAlign = 'left'
  const caracterX = 80
  let caracterY = y
  const caracterFields: (keyof CartolaData)[] = [
    'caracteristica1',
    'caracteristica2',
    'caracteristica3',
  ]
  caracterFields.forEach((field) => {
    const texto = data[field]
    if (texto) {
      const st = styles[field]
      const fontSize = st.fontSize || 28
      ctx.fillStyle = st.color || textoClaro
      ctx.font = `${st.bold ? 'bold ' : ''}${fontSize}px Arial`
      ctx.fillText(`• ${texto}`, caracterX, caracterY + fontSize)
      caracterY += fontSize + 12 + st.spacing
    }
  })
  // Mensaje final
  if (data.mensajeFinal) {
    const st = styles.mensajeFinal
    ctx.textAlign = 'center'
    ctx.fillStyle = st.color || textoClaro
    const fontSize = st.fontSize || 32
    ctx.font = `${st.bold ? 'bold ' : ''}${fontSize}px Arial`
    const lineHeight = fontSize * 1.3
    drawTextWithLineBreaks(
      ctx,
      data.mensajeFinal,
      canvas.width / 2,
      caracterY + 60,
      lineHeight,
      canvas.width - 160,
    )
  }
}

// Dibuja un rectángulo con esquinas redondeadas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// Dibuja texto con soporte de saltos de línea y envoltura de palabras
function drawTextWithLineBreaks(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  lineHeight: number,
  maxWidth?: number,
) {
  const lines = text.split('\n')
  let currentY = startY
  lines.forEach((line) => {
    if (maxWidth && ctx.measureText(line).width > maxWidth) {
      const words = line.split(' ')
      let currentLine = ''
      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        if (ctx.measureText(testLine).width > maxWidth) {
          if (currentLine) {
            ctx.fillText(currentLine, x, currentY)
            currentY += lineHeight
          }
          currentLine = word
        } else {
          currentLine = testLine
        }
      })
      if (currentLine) {
        ctx.fillText(currentLine, x, currentY)
        currentY += lineHeight
      }
    } else {
      ctx.fillText(line, x, currentY)
      currentY += lineHeight
    }
  })
  return currentY
}

// Determina si un color hexadecimal es oscuro
function isDark(hex: string): boolean {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 128
}

export default CartolaModal