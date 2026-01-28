# TODO - Start Delivery Address Selection

## Task
When using `selectDireccion()` function, save the selected address to `direccionRecogida` and/or `direccionEntrega` if those fields are null.

## Plan
1. ✅ Analyze the current implementation
2. ✅ Create plan and get user confirmation
3. ✅ Modify `selectDireccion()` function in start-delivery.component.ts
   - Store full address object instead of just display name
   - If `direccionRecogida` form control is null/empty → set it
   - Otherwise if `direccionEntrega` form control is null/empty → set it
   - Update both component properties and form controls
4. ✅ Implementation complete

## Implementation Details
- Current: `this.direccionSeleccionada = direccion.nombres_completos;`
- New: Check form controls and assign address object to appropriate field

