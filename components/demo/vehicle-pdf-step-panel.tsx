"use client"

import { useMemo, useState } from "react"
import { Eye, FileText, Printer } from "lucide-react"

import { RegistrationPdfPreviewDialog } from "@/components/demo/registration-pdf-preview-dialog"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { buildVehicleRegistrationPacket } from "@/lib/build-registration-packet"
import { isDemoIdScanComplete } from "@/lib/demo/demo-storage"
import {
  isVehiclePdfPreviewed,
  markVehiclePdfPreviewed,
} from "@/lib/demo/vehicle-pdf-storage"
import { isVehiclePaperScanComplete } from "@/lib/demo/vehicle-paper-storage"
import {
  buildRegistrationPacketHtml,
  printRegistrationPacketHtml,
} from "@/lib/download-pdf"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"

type VehiclePdfStepPanelProps = {
  guide: ProcessGuide
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  onPreviewUpdate?: () => void
}

export function VehiclePdfStepPanel({
  guide,
  step,
  labels,
  onPreviewUpdate,
}: VehiclePdfStepPanelProps) {
  const { locale } = useLocale()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewed, setPreviewed] = useState(isVehiclePdfPreviewed)
  const doc = step.document!

  const canBuild =
    isDemoIdScanComplete() && isVehiclePaperScanComplete()

  const packetHtml = useMemo(() => {
    if (!canBuild) return ""
    const packet = buildVehicleRegistrationPacket({
      guide,
      locale,
      labels: {
        applicantSection: labels.pdfApplicantSection,
        vehicleSection: labels.pdfVehicleSection,
        priorUploadsSection: labels.pdfPriorUploadsSection,
        attachmentsSection: labels.pdfAttachmentsSection,
        idSubsection: labels.pdfIdSubsection,
        footer: labels.downloadFooter,
      },
    })
    return buildRegistrationPacketHtml(packet)
  }, [canBuild, guide, locale, labels])

  function openPreview() {
    if (!packetHtml) return
    markVehiclePdfPreviewed()
    setPreviewed(true)
    onPreviewUpdate?.()
    setPreviewOpen(true)
  }

  function printDirect() {
    if (!packetHtml) return
    markVehiclePdfPreviewed()
    setPreviewed(true)
    onPreviewUpdate?.()
    printRegistrationPacketHtml(packetHtml, "registration-packet.pdf")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-sm">{labels.vehiclePdfIntro}</p>
        <HelpChatButton scope="document_step" step={step} documentName={doc.name} />
      </div>

      <div className="rounded-lg border bg-background p-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <FileText className="size-4 text-primary" />
          {doc.name}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{doc.note}</p>
      </div>

      {!canBuild ? (
        <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-3 text-sm">
          {labels.completeVehicleScansFirst}
        </p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1 gap-2"
            onClick={openPreview}
          >
            <Eye className="size-4" />
            {labels.previewRegistrationPdf}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={printDirect}
          >
            <Printer className="size-4" />
            {labels.printRegistrationPdf}
          </Button>
        </div>
      )}

      {previewed && (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {labels.vehiclePdfReady}
        </p>
      )}

      <RegistrationPdfPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        html={packetHtml}
        title={labels.pdfPreviewTitle}
        printLabel={labels.printRegistrationPdf}
        closeLabel={labels.closePdfPreview}
      />
    </div>
  )
}
