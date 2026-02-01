import jsPDF from 'jspdf'

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

// Map condition to letter code
function conditionToCode(condition: string): string {
  switch (condition) {
    case 'Perfekt': return 'N' // Nyistandsat
    case 'Brugsspor': return 'G' // God stand
    case 'Mangel': return 'D' // Dårlig stand
    default: return ''
  }
}

export async function generatePDF(inspection: InspectionData) {
  const doc = new jsPDF()
  let yPosition = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  // Format date
  const formattedDate = inspection.inspection_date 
    ? new Date(inspection.inspection_date).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })

  // Helper to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 280) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Group rooms by type for easier lookup
  const roomsByName: { [key: string]: Array<{ condition: string, description: string, photos: any[] }> } = {}
  if (inspection.rooms) {
    inspection.rooms.forEach(room => {
      if (!roomsByName[room.room_name]) {
        roomsByName[room.room_name] = []
      }
      roomsByName[room.room_name].push({
        condition: room.condition,
        description: room.description,
        photos: room.photos || []
      })
    })
  }

  // ===== HEADER =====
  doc.setFillColor(240, 240, 240)
  doc.rect(0, 0, pageWidth, 45, 'F')
  
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('INDFLYTNINGSRAPPORT', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text('Jf. Lejelovens § 9', pageWidth / 2, 28, { align: 'center' })
  doc.text(`Oprettet: ${formattedDate}`, pageWidth / 2, 35, { align: 'center' })
  
  yPosition = 55

  // ===== LEJEMÅLETS OPLYSNINGER =====
  doc.setFillColor(50, 50, 50)
  doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('LEJEMÅLETS OPLYSNINGER', margin + 5, yPosition)
  yPosition += 10
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  
  // Info boxes
  const boxHeight = 18
  const boxWidth = contentWidth / 2 - 3
  
  // Lejer box
  doc.setFillColor(248, 248, 248)
  doc.rect(margin, yPosition, boxWidth, boxHeight, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('LEJER', margin + 4, yPosition + 5)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(inspection.tenant_name || '-', margin + 4, yPosition + 13)
  
  // Adresse box
  doc.setFillColor(248, 248, 248)
  doc.rect(margin + boxWidth + 6, yPosition, boxWidth, boxHeight, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('ADRESSE', margin + boxWidth + 10, yPosition + 5)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(inspection.address || '-', margin + boxWidth + 10, yPosition + 13)
  
  yPosition += boxHeight + 5
  
  // Indflytningsdato box
  doc.setFillColor(248, 248, 248)
  doc.rect(margin, yPosition, boxWidth, boxHeight, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('INDFLYTNINGSDATO', margin + 4, yPosition + 5)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(formattedDate, margin + 4, yPosition + 13)
  
  // Besigtigelsesdato box
  doc.setFillColor(248, 248, 248)
  doc.rect(margin + boxWidth + 6, yPosition, boxWidth, boxHeight, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('BESIGTIGELSE FORETAGET', margin + boxWidth + 10, yPosition + 5)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(formattedDate, margin + boxWidth + 10, yPosition + 13)
  
  yPosition += boxHeight + 12

  // ===== MÅLERAFLÆSNINGER =====
  if (inspection.el_reading || inspection.water_reading || inspection.heat_reading) {
    doc.setFillColor(50, 50, 50)
    doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('MÅLERAFLÆSNINGER', margin + 5, yPosition)
    yPosition += 10
    
    const meterBoxWidth = contentWidth / 3 - 4
    let meterX = margin
    
    if (inspection.el_reading) {
      doc.setFillColor(255, 251, 235)
      doc.rect(meterX, yPosition, meterBoxWidth, 22, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(180, 140, 0)
      doc.text('EL-MÅLER' + (inspection.el_meter_no ? ` (${inspection.el_meter_no})` : ''), meterX + 4, yPosition + 5)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`${inspection.el_reading} kWh`, meterX + 4, yPosition + 16)
      meterX += meterBoxWidth + 6
    }
    
    if (inspection.water_reading) {
      doc.setFillColor(239, 246, 255)
      doc.rect(meterX, yPosition, meterBoxWidth, 22, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(0, 100, 180)
      doc.text('VANDMÅLER', meterX + 4, yPosition + 5)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`${inspection.water_reading} m³`, meterX + 4, yPosition + 16)
      meterX += meterBoxWidth + 6
    }
    
    if (inspection.heat_reading) {
      doc.setFillColor(254, 242, 242)
      doc.rect(meterX, yPosition, meterBoxWidth, 22, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(180, 50, 50)
      doc.text('VARMEMÅLER', meterX + 4, yPosition + 5)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`${inspection.heat_reading} GJ`, meterX + 4, yPosition + 16)
    }
    
    yPosition += 30
  }

  // ===== NØGLER =====
  if (inspection.key_count) {
    doc.setFillColor(50, 50, 50)
    doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('NØGLER', margin + 5, yPosition)
    yPosition += 10
    
    doc.setFillColor(248, 248, 248)
    const keyBoxHeight = inspection.key_notes ? 28 : 18
    doc.rect(margin, yPosition, contentWidth, keyBoxHeight, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`${inspection.key_count} stk. nøgler udleveret`, margin + 4, yPosition + 8)
    
    if (inspection.key_notes) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      const splitNotes = doc.splitTextToSize(inspection.key_notes, contentWidth - 8)
      doc.text(splitNotes, margin + 4, yPosition + 18)
    }
    
    yPosition += keyBoxHeight + 10
  }

  // ===== RUMINSPEKTION =====
  if (inspection.rooms && inspection.rooms.length > 0) {
    checkPageBreak(40)
    
    doc.setFillColor(50, 50, 50)
    doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('RUMINSPEKTION', margin + 5, yPosition)
    yPosition += 12
    
    // Forklaring af vurderinger
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('Tilstandsvurdering:  ', margin, yPosition)
    
    // Legend items
    const legendItems = [
      { code: 'N', label: 'Nyistandsat', color: [34, 197, 94] },
      { code: 'G', label: 'God stand', color: [234, 179, 8] },
      { code: 'D', label: 'Dårlig/Mangel', color: [239, 68, 68] }
    ]
    
    let legendX = margin + 35
    for (const item of legendItems) {
      doc.setFillColor(item.color[0], item.color[1], item.color[2])
      doc.circle(legendX, yPosition - 1, 2, 'F')
      doc.setTextColor(0, 0, 0)
      doc.text(`${item.code} = ${item.label}`, legendX + 4, yPosition)
      legendX += 40
    }
    yPosition += 8
    
    // Group rooms and display
    for (const [roomName, entries] of Object.entries(roomsByName)) {
      checkPageBreak(30)
      
      // Room header
      doc.setFillColor(245, 245, 245)
      doc.rect(margin, yPosition - 4, contentWidth, 10, 'F')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(roomName.toUpperCase(), margin + 4, yPosition + 2)
      yPosition += 12
      
      // Each entry for this room
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        checkPageBreak(20)
        
        // Condition indicator
        const conditionColors: { [key: string]: [number, number, number] } = {
          'Perfekt': [34, 197, 94],
          'Brugsspor': [234, 179, 8],
          'Mangel': [239, 68, 68]
        }
        const color = conditionColors[entry.condition] || [100, 100, 100]
        
        doc.setFillColor(color[0], color[1], color[2])
        doc.circle(margin + 4, yPosition, 3, 'F')
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(`${entry.condition} (${conditionToCode(entry.condition)})`, margin + 10, yPosition + 1)
        yPosition += 6
        
        if (entry.description) {
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(60, 60, 60)
          const splitDesc = doc.splitTextToSize(entry.description, contentWidth - 15)
          doc.text(splitDesc, margin + 10, yPosition)
          yPosition += splitDesc.length * 4 + 4
        } else {
          yPosition += 2
        }
        
        // Photo count indicator
        if (entry.photos && entry.photos.length > 0) {
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 100)
          doc.text(`[${entry.photos.length} billede${entry.photos.length > 1 ? 'r' : ''} - se fotodokumentation]`, margin + 10, yPosition)
          yPosition += 5
        }
        
        yPosition += 3
      }
      yPosition += 5
    }
  }

  // ===== UNDERSKRIFTER =====
  checkPageBreak(70)
  
  doc.setFillColor(50, 50, 50)
  doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('UNDERSKRIFTER', margin + 5, yPosition)
  yPosition += 15
  
  // Signatures side by side
  const sigWidth = (contentWidth - 15) / 2
  
  // Udlejer
  doc.setFillColor(248, 248, 248)
  doc.rect(margin, yPosition, sigWidth, 45, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('UDLEJER', margin + 4, yPosition + 5)
  
  if (inspection.landlord_signature) {
    try {
      doc.addImage(inspection.landlord_signature, 'PNG', margin + 10, yPosition + 10, 50, 20)
    } catch (error) {
      console.error('Error adding landlord signature:', error)
    }
  }
  doc.setDrawColor(180, 180, 180)
  doc.line(margin + 4, yPosition + 35, margin + sigWidth - 4, yPosition + 35)
  doc.setFontSize(7)
  doc.text('Dato: ' + formattedDate, margin + 4, yPosition + 42)
  
  // Lejer
  doc.setFillColor(248, 248, 248)
  doc.rect(margin + sigWidth + 15, yPosition, sigWidth, 45, 'F')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('LEJER (' + inspection.tenant_name + ')', margin + sigWidth + 19, yPosition + 5)
  
  if (inspection.tenant_signature) {
    try {
      doc.addImage(inspection.tenant_signature, 'PNG', margin + sigWidth + 25, yPosition + 10, 50, 20)
    } catch (error) {
      console.error('Error adding tenant signature:', error)
    }
  }
  doc.line(margin + sigWidth + 19, yPosition + 35, margin + 2 * sigWidth + 11, yPosition + 35)
  doc.setFontSize(7)
  doc.text('Dato: ' + formattedDate, margin + sigWidth + 19, yPosition + 42)
  
  yPosition += 55

  // ===== JURIDISK TEKST =====
  checkPageBreak(30)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  
  const legalText = 'Denne indflytningsrapport er udarbejdet i henhold til Lejelovens § 9. Er det lejede mangelfuldt ved lejeforholdets begyndelse, skal lejer for ikke at miste retten til at påberåbe sig manglen senest 14 dage efter lejeforholdets begyndelse skriftligt meddele, at lejeren vil gøre den gældende. Parterne bekræfter med deres underskrift at være enige om den vedligeholdelsestilstand for lejemålet, der fremgår af denne rapport.'
  const splitLegal = doc.splitTextToSize(legalText, contentWidth)
  doc.text(splitLegal, margin, yPosition)
  yPosition += splitLegal.length * 3 + 5

  // Bekræftelse
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)
  doc.text('Lejer bekræfter at have modtaget kopi af denne indflytningsrapport.', margin, yPosition)

  // ===== FOTODOKUMENTATION =====
  if (inspection.rooms) {
    const roomsWithPhotos = inspection.rooms.filter(r => r.photos && r.photos.length > 0)
    
    if (roomsWithPhotos.length > 0) {
      doc.addPage()
      yPosition = 20
      
      // Header
      doc.setFillColor(240, 240, 240)
      doc.rect(0, 0, pageWidth, 30, 'F')
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('FOTODOKUMENTATION', pageWidth / 2, 18, { align: 'center' })
      yPosition = 40

      for (const room of roomsWithPhotos) {
        checkPageBreak(30)
        
        // Room header
        doc.setFillColor(50, 50, 50)
        doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(`${room.room_name.toUpperCase()} - ${room.condition}`, margin + 5, yPosition)
        yPosition += 8
        
        if (room.description) {
          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(60, 60, 60)
          const splitDesc = doc.splitTextToSize(room.description, contentWidth)
          doc.text(splitDesc, margin, yPosition)
          yPosition += splitDesc.length * 4 + 5
        }

        // Photos - 2 per row
        let photoX = margin
        let photosInRow = 0
        const photoWidth = (contentWidth - 10) / 2
        const photoHeight = 55

        for (const photo of room.photos) {
          try {
            checkPageBreak(photoHeight + 10)
            
            if (photosInRow === 2) {
              photoX = margin
              photosInRow = 0
              yPosition += photoHeight + 8
            }
            
            const base64Image = await loadImageAsBase64(photo.url)
            doc.addImage(base64Image, 'JPEG', photoX, yPosition, photoWidth, photoHeight)
            
            photoX += photoWidth + 10
            photosInRow++
          } catch (error) {
            console.error('Failed to load image:', error)
          }
        }
        
        if (photosInRow > 0) {
          yPosition += photoHeight + 10
        }
        yPosition += 5
      }
    }
  }

  // ===== FOOTER ON ALL PAGES =====
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text('Digitalt Indflytningssyn', margin, 290)
    doc.text(`${inspection.address} • ${formattedDate}`, pageWidth / 2, 290, { align: 'center' })
    doc.text(`Side ${i} af ${pageCount}`, pageWidth - margin, 290, { align: 'right' })
  }

  // Save the PDF
  const safeFileName = `Indflytningsrapport_${inspection.address.replace(/[^a-zA-Z0-9æøåÆØÅ\s]/g, '').replace(/\s+/g, '_')}_${inspection.inspection_date}.pdf`
  doc.save(safeFileName)
}

