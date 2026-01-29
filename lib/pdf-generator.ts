import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface InspectionData {
  id: string
  tenant_name: string
  address: string
  inspection_date: string
  landlord_signature?: string
  tenant_signature?: string
  el_meter_no?: string
  el_reading?: number
  water_reading?: number
  heat_reading?: number
  key_count?: number
  key_notes?: string
  rooms?: Array<{
    room_name: string
    condition: string
    description: string
    photos: Array<{
      url: string
    }>
  }>
}

// Helper function to load and convert image to base64
async function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

export async function generatePDF(inspection: InspectionData) {
  const doc = new jsPDF()
  let yPosition = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Helper to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 280) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // ===== HEADER =====
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(14, 84, 126) // Primary color
  doc.text('Indflytningssyn', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Iht. Lejeloven § 10', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // ===== BASIC INFO =====
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Lejer:', margin, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(inspection.tenant_name, margin + 20, yPosition)
  yPosition += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Adresse:', margin, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(inspection.address, margin + 23, yPosition)
  yPosition += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Dato:', margin, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(inspection.inspection_date).toLocaleDateString('da-DK'), margin + 15, yPosition)
  yPosition += 15

  // ===== METER READINGS =====
  if (inspection.el_reading || inspection.water_reading || inspection.heat_reading) {
    checkPageBreak(35)
    doc.setFillColor(240, 248, 255)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 30, 'F')
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(14, 84, 126)
    doc.text('Måleraflæsning', margin + 5, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    if (inspection.el_meter_no || inspection.el_reading) {
      doc.text(`El-måler ${inspection.el_meter_no || ''}: ${inspection.el_reading || '-'} kWh`, margin + 5, yPosition)
      yPosition += 5
    }
    if (inspection.water_reading) {
      doc.text(`Vandmåler: ${inspection.water_reading} m³`, margin + 5, yPosition)
      yPosition += 5
    }
    if (inspection.heat_reading) {
      doc.text(`Varmemåler: ${inspection.heat_reading} GJ/MWh`, margin + 5, yPosition)
      yPosition += 5
    }
    yPosition += 10
  }

  // ===== KEYS =====
  if (inspection.key_count) {
    checkPageBreak(20)
    doc.setFillColor(255, 251, 235)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, Math.min(inspection.key_notes ? 25 : 12, 40), 'F')
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(202, 138, 4)
    doc.text('Nøgler', margin + 5, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`Antal: ${inspection.key_count} stk.`, margin + 5, yPosition)
    yPosition += 5

    if (inspection.key_notes) {
      const splitNotes = doc.splitTextToSize(inspection.key_notes, pageWidth - 2 * margin - 10)
      doc.text(splitNotes, margin + 5, yPosition)
      yPosition += splitNotes.length * 5 + 5
    }
    yPosition += 5
  }

  // ===== ROOMS =====
  if (inspection.rooms && inspection.rooms.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Rum-for-Rum Inspektion', margin, yPosition)
    yPosition += 10

    // Group rooms by name
    const roomGroups: { [key: string]: NonNullable<typeof inspection.rooms> } = {}
    inspection.rooms.forEach(room => {
      if (!roomGroups[room.room_name]) {
        roomGroups[room.room_name] = []
      }
      roomGroups[room.room_name]!.push(room)
    })

    for (const [roomName, roomEntries] of Object.entries(roomGroups)) {
    checkPageBreak(25)

    // Room header
    doc.setFillColor(245, 245, 245)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 138)
    doc.text(roomName, margin + 3, yPosition)
    yPosition += 10

    // Process each entry for this room
    for (let i = 0; i < roomEntries.length; i++) {
      const room = roomEntries[i]
      
      checkPageBreak(15)
      
      if (roomEntries.length > 1) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(100, 100, 100)
        doc.text(`Bemærkning ${i + 1}:`, margin + 5, yPosition)
        yPosition += 6
      }

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)

      // Color code condition
      const conditionColors: { [key: string]: [number, number, number] } = {
        'Perfekt': [34, 197, 94],
        'Brugsspor': [251, 191, 36],
        'Mangel': [239, 68, 68]
      }
      const color = conditionColors[room.condition] || [0, 0, 0]
      doc.setTextColor(...color)
      doc.text(`Stand: ${room.condition}`, margin + 5, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 6

      if (room.description) {
        doc.setFont('helvetica', 'normal')
        const splitDescription = doc.splitTextToSize(room.description, pageWidth - 2 * margin - 10)
        doc.text(splitDescription, margin + 5, yPosition)
        yPosition += splitDescription.length * 5 + 3
      }

      // ===== EMBED PHOTOS =====
      if (room.photos && room.photos.length > 0) {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(100, 100, 100)
        doc.text(`Dokumentation (${room.photos.length} billede${room.photos.length > 1 ? 'r' : ''}):`, margin + 5, yPosition)
        yPosition += 6

        for (const photo of room.photos) {
          try {
            checkPageBreak(60)
            
            // Load and embed image
            const base64Image = await loadImageAsBase64(photo.url)
            const imgWidth = 80
            const imgHeight = 60
            
            doc.addImage(base64Image, 'JPEG', margin + 10, yPosition, imgWidth, imgHeight)
            yPosition += imgHeight + 5
          } catch (error) {
            console.error('Failed to load image:', error)
            doc.setFontSize(8)
            doc.setTextColor(200, 0, 0)
            doc.text('Billede kunne ikke indlæses', margin + 10, yPosition)
            yPosition += 5
          }
        }
      }

      yPosition += 5
    }

    yPosition += 3
  }
  } // End of rooms section

  // ===== SIGNATURES =====
  checkPageBreak(70)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Underskrifter', margin, yPosition)
  yPosition += 12

  // Landlord Signature
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Udlejer:', margin, yPosition)
  yPosition += 6
  
  if (inspection.landlord_signature) {
    try {
      doc.addImage(inspection.landlord_signature, 'PNG', margin, yPosition, 70, 20)
    } catch (error) {
      console.error('Error adding landlord signature:', error)
    }
  }
  doc.setLineWidth(0.3)
  doc.setDrawColor(150, 150, 150)
  doc.line(margin, yPosition + 20, margin + 70, yPosition + 20)
  yPosition += 30

  // Tenant Signature
  doc.setFont('helvetica', 'bold')
  doc.text(`Lejer (${inspection.tenant_name}):`, margin, yPosition)
  yPosition += 6
  
  if (inspection.tenant_signature) {
    try {
      doc.addImage(inspection.tenant_signature, 'PNG', margin, yPosition, 70, 20)
    } catch (error) {
      console.error('Error adding tenant signature:', error)
    }
  }
  doc.setLineWidth(0.3)
  doc.line(margin, yPosition + 20, margin + 70, yPosition + 20)

  // ===== FOOTER ON ALL PAGES =====
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Side ${i} af ${pageCount} • Genereret ${new Date().toLocaleDateString('da-DK')} kl. ${new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    )
    doc.text(
      'Digitalt Indflytningssyn • Lovligt dokument iht. Lejeloven',
      pageWidth / 2,
      295,
      { align: 'center' }
    )
  }

  // Save the PDF
  const fileName = `Indflytningssyn_${inspection.tenant_name.replace(/\s+/g, '_')}_${inspection.address.replace(/[,\s]+/g, '_')}_${inspection.inspection_date}.pdf`
  doc.save(fileName)
}

