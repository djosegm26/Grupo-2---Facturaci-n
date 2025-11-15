import express from "express";
import Factura from "../models/Factura.js";
import DetalleFactura from "../models/DetalleFactura.js";
import Cliente from "../models/Cliente.js";
import Producto from "../models/Producto.js";
import Servicio from "../models/Servicio.js";
import { crearFacturaEnFactus } from "../services/factusService.js";

const router = express.Router();

router.get("/enviar/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const factura = await Factura.findByPk(id);
    if (!factura)
      return res.status(404).json({ ok: false, msg: "Factura no encontrada" });

    const detalles = await DetalleFactura.findAll({ where: { factura_id: id } });
    const cliente = await Cliente.findByPk(factura.cliente_id);

    // ------------------------------------
    // MAPEO AL FORMATO DE FACTUS
    // ------------------------------------
    const items = await Promise.all(
  detalles.map(async (d) => {

    let prod = null;
    if (d.producto_id) prod = await Producto.findByPk(d.producto_id);
    if (d.servicio_id)
      prod = prod || (await Servicio.findByPk(d.servicio_id));

    const basePrice = Number(d.precio_unitario);            // SIN IVA
    const priceWithIVA = basePrice * 1.19;                  // CON IVA

    return {
      code_reference: String(prod?.id || d.id),
      name: prod?.nombre || d.descripcion || "Item",

      quantity: Number(d.cantidad) || 1,

      // 💥 ENVÍO OBLIGATORIO PARA QUE NO TE REPARTA EL IVA
      price_base: basePrice,        // SIN IVA
      price: priceWithIVA,          // CON IVA

      tax_rate: "19.00",
      in_base: 0,                    // 0 = el price ya CONTIENE el IVA

      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,

      discount: 0,
      discount_rate: 0,
      withholding_taxes: []
    };
  })
);

    // ------------------------------------
    // PAYLOAD COMPLETO PARA FACTUS
    // ------------------------------------
    const payload = {
      document: "01",
      numbering_range_id: 8,
      reference_code: `FAC-${id}-${Date.now()}`,
      observation: "",
      payment_method_code: "10",

      customer: {
        identification: cliente?.numero_identificacion || "000000000",
        dv: "0",
        company: "",
        trade_name: "",
        names:
          cliente?.nombre ||
          `${cliente?.nombres || ""} ${cliente?.apellidos || ""}`.trim(),
        address: cliente?.direccion || "SIN DIRECCIÓN",
        email: cliente?.email || "test@test.com",
        phone: cliente?.telefono || "3000000000",
        legal_organization_id: "2",
        tribute_id: "21",
        identification_document_id: "3",
        municipality_id: "980"
      },

      items
    };

    // ------------------------------------
    // ENVIAR A FACTUS
    // ------------------------------------
    const resp = await crearFacturaEnFactus(payload);

    // URL Pública del PDF
    const publicUrl =
      resp?.data?.bill?.public_url ||
      resp?.bill?.public_url ||
      resp?.public_url ||
      null;

    return res.json({
      ok: true,
      pdf_url: publicUrl,
      factus_response: resp
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: err.response?.data || err.message
    });
  }
});

export default router;
