//LAYOUT
$(document).ready(function () {
    $('.nav .dropdown').hover(
        function () { $(this).addClass('open'); },
        function () { $(this).removeClass('open'); }
    );
});

//INGRES0 DE ASIENTOS CONTABLES MANUALES
$(document).ready(function () {
    function actualizarVisibilidadTabla() {
        var filas = $(".detalle-asientos tbody tr").length;
        if (filas > 0) {
            $(".detalle-asientos").show();
        } else {
            $(".detalle-asientos").hide();
        }
    }

    $('#detalleAsientoModal').on('hidden.bs.modal', function () {
        $("#mensajeValidacionDetalle").hide().text("");
    });

    $('#detalleAsientoModal a[data-toggle="tab"]').on('shown.bs.tab', function () {
        $("#mensajeValidacionDetalle").hide().text("");
    });

    function mostrarMensaje(mensaje) {
        $("#mensajeModalTexto").text(mensaje);
        $("#mensajeModal").modal("show");
    }

    function actualizarTotales() {
        var totalDebitoMN = 0, totalCreditoMN = 0, totalDebitoME = 0, totalCreditoME = 0;

        $(".detalle-asientos tbody tr").each(function () {
            var $td = $(this).find("td");

            totalDebitoMN += parseFloat($td.eq(7).text().replace(/,/g, "")) || 0;
            totalCreditoMN += parseFloat($td.eq(8).text().replace(/,/g, "")) || 0;
            totalDebitoME += parseFloat($td.eq(9).text().replace(/,/g, "")) || 0;
            totalCreditoME += parseFloat($td.eq(10).text().replace(/,/g, "")) || 0;
        });

        $("#totalDebitoMN").text(totalDebitoMN.toFixed(2));
        $("#totalCreditoMN").text(totalCreditoMN.toFixed(2));
        $("#totalDebitoME").text(totalDebitoME.toFixed(2));
        $("#totalCreditoME").text(totalCreditoME.toFixed(2));
    }

    function validarAsiento() {
        var filas = $(".detalle-asientos tbody tr").length;

        if (filas === 0) {
            $("#leyendaAsiento").removeClass("ok error")
                .text(" ");
            return;
        }

        var totalDebitoMN = 0, totalCreditoMN = 0;
        var totalDebitoME = 0, totalCreditoME = 0;

        $(".detalle-asientos tbody tr").each(function () {
            var $td = $(this).find("td");

            totalDebitoMN += parseFloat($td.eq(7).text().replace(/,/g, "")) || 0;
            totalCreditoMN += parseFloat($td.eq(8).text().replace(/,/g, "")) || 0;
            totalDebitoME += parseFloat($td.eq(9).text().replace(/,/g, "")) || 0;
            totalCreditoME += parseFloat($td.eq(10).text().replace(/,/g, "")) || 0;
        });

        var cuadradoMN = totalDebitoMN.toFixed(2) === totalCreditoMN.toFixed(2);
        var cuadradoME = totalDebitoME.toFixed(2) === totalCreditoME.toFixed(2);

        if (cuadradoMN && cuadradoME) {
            $("#leyendaAsiento").removeClass("error").addClass("ok")
                .text("El asiento esta cuadrado (MN y ME)");
        } else if (!cuadradoMN && cuadradoME) {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento esta descuadrado en MN (Debito: " + totalDebitoMN.toFixed(2) +
                    " y Credito: " + totalCreditoMN.toFixed(2) + ")");
        } else if (cuadradoMN && !cuadradoME) {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento esta descuadrado en ME (Debito: " + totalDebitoME.toFixed(2) +
                    " y Credito: " + totalCreditoME.toFixed(2) + ")");
        } else {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento esta descuadrado en MN y ME");
        }
    }

    function validarCampos(tabId) {
        var valido = true;
        var mensaje = "";

        if (tabId === "tipo1") {
            if (!$("#oficinaTipo1").val()) { valido = false; mensaje = "Seleccione oficina"; }
            else if (!$("#tipoMovimientoTipo1").val()) { valido = false; mensaje = "Seleccione tipo de movimiento"; }
            else if (!$("#valorMovimientoTipo1").val()) { valido = false; mensaje = "Ingrese valor movimiento"; }
        }
        else if (tabId === "tipo2") {
            if (!$("#oficinaTipo2").val()) { valido = false; mensaje = "Seleccione oficina"; }
            else if (!$("#tipoMovimientoTipo2").val()) { valido = false; mensaje = "Seleccione tipo de movimiento"; }
            else if (!$("#valorMNtipo2").val()) { valido = false; mensaje = "Ingrese valor MN"; }
            else if (!$("#valorMEtipo2").val()) { valido = false; mensaje = "Ingrese valor ME"; }
        }
        else if (tabId === "tipo3") {
            if (!$("#oficinaTipo3").val()) { valido = false; mensaje = "Seleccione oficina"; }
            else if (!$("#tipoMovimientoTipo3").val()) { valido = false; mensaje = "Seleccione tipo de movimiento"; }
            else if (!$("#valorMovimientoTipo3").val()) { valido = false; mensaje = "Ingrese valor movimiento"; }
            else if (!$("#motivoTipo3").val()) { valido = false; mensaje = "Ingrese motivo / centro costo / producto"; }
        }

        if (!valido) {
            $("#mensajeValidacionDetalle").text(mensaje).show();
        } else {
            $("#mensajeValidacionDetalle").hide();
        }

        return valido;
    }

    var filaAEliminar = null;
    var filaAEditar = null;

    $("#btnGuardarDetalle").on("click", function () {
        var activeTab = $(".tab-pane.active").attr("id");

        if (!validarCampos(activeTab)) {
            return;
        }

        var nuevaFila = "";

        if (activeTab === "tipo1") {
            var cuenta = $("#numeroCuentaTipo1").val();
            var moneda = $("#monedaTipo1").val();
            var descCuenta = $("#descripcionCuentaTipo1").val();
            var oficina = $("#oficinaTipo1").val();
            var descMovimiento = $("#descripcionMovimientoTipo1").val();
            var tipoMovimiento = $("#tipoMovimientoTipo1").val();
            var valorMovimiento = parseFloat($("#valorMovimientoTipo1").val()) || 0;

            var debitoMN = (tipoMovimiento === "debito") ? valorMovimiento.toFixed(2) : "0.00";
            var creditoMN = (tipoMovimiento === "credito") ? valorMovimiento.toFixed(2) : "0.00";

            nuevaFila = `
                <td>${cuenta}</td>
                <td>${descCuenta}</td>
                <td>${moneda}</td>
                <td>${oficina}</td>
                <td>${descMovimiento}</td>
                <td>-</td>
                <td>-</td>
                <td class="text-right">${debitoMN}</td>
                <td class="text-right">${creditoMN}</td>
                <td class="text-right">0.00</td>
                <td class="text-right">0.00</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                    <button class="btn btn-xs btn-primary btn-edit"><i class="glyphicon glyphicon-pencil"></i></button>
                    <button class="btn btn-xs btn-magenta btn-delete"><i class="glyphicon glyphicon-trash"></i></button>
                </td>`;
        }

        else if (activeTab === "tipo2") {
            var cuenta = $("#numeroCuentaTipo2").val();
            var moneda = $("#monedaTipo2").val();
            var descCuenta = $("#descripcionCuentaTipo2").val();
            var oficina = $("#oficinaTipo2").val();
            var descMovimiento = $("#descripcionMovimientoTipo2").val();
            var tipoMovimiento = $("#tipoMovimientoTipo2").val();

            var valorMN = parseFloat($("#valorMNtipo2").val()) || 0;
            var valorME = parseFloat($("#valorMEtipo2").val()) || 0;

            var debitoMN = (tipoMovimiento === "debito") ? valorMN.toFixed(2) : "0.00";
            var creditoMN = (tipoMovimiento === "credito") ? valorMN.toFixed(2) : "0.00";

            var debitoME = (tipoMovimiento === "debito") ? valorME.toFixed(2) : "0.00";
            var creditoME = (tipoMovimiento === "credito") ? valorME.toFixed(2) : "0.00";

            nuevaFila = `
                <td>${cuenta}</td>
                <td>${descCuenta}</td>
                <td>${moneda}</td>
                <td>${oficina}</td>
                <td>${descMovimiento}</td>
                <td>-</td>
                <td>-</td>
                <td class="text-right">${debitoMN}</td>
                <td class="text-right">${creditoMN}</td>
                <td class="text-right">${debitoME}</td>
                <td class="text-right">${creditoME}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                    <button class="btn btn-xs btn-primary btn-edit"><i class="glyphicon glyphicon-pencil"></i></button>
                    <button class="btn btn-xs btn-magenta btn-delete"><i class="glyphicon glyphicon-trash"></i></button>
                </td>`;
        }

        else if (activeTab === "tipo3") {
            var cuenta = $("#numeroCuentaTipo3").val();
            var moneda = $("#monedaTipo3").val();
            var descCuenta = $("#descripcionCuentaTipo3").val();
            var oficina = $("#oficinaTipo3").val();
            var descMovimiento = $("#descripcionMovimientoTipo3").val();
            var motivo = $("#motivoTipo3").val();
            var tipoMovimiento = $("#tipoMovimientoTipo3").val();
            var valorMovimiento = parseFloat($("#valorMovimientoTipo3").val()) || 0;

            var debitoMN = (tipoMovimiento === "debito") ? valorMovimiento.toFixed(2) : "0.00";
            var creditoMN = (tipoMovimiento === "credito") ? valorMovimiento.toFixed(2) : "0.00";

            nuevaFila = `
                <td>${cuenta}</td>
                <td>${descCuenta}</td>
                <td>${moneda}</td>
                <td>${oficina}</td>
                <td>${descMovimiento}</td>
                <td>-</td>
                <td>-</td>
                <td class="text-right">${debitoMN}</td>
                <td class="text-right">${creditoMN}</td>
                <td class="text-right">0.00</td>
                <td class="text-right">0.00</td>
                <td>${motivo}</td>
                <td>${motivo}</td>
                <td>${motivo}</td>
                <td>
                    <button class="btn btn-xs btn-primary btn-edit"><i class="glyphicon glyphicon-pencil"></i></button>
                    <button class="btn btn-xs btn-magenta btn-delete"><i class="glyphicon glyphicon-trash"></i></button>
                </td>`;
        }

        if (nuevaFila) {
            if (filaAEditar) {
                filaAEditar.html(nuevaFila);
                filaAEditar = null;
            } else {
                $(".detalle-asientos tbody").append("<tr>" + nuevaFila + "</tr>");
            }
            actualizarTotales();
            validarAsiento();
            actualizarVisibilidadTabla();
            $("#detalleAsientoModal").modal("hide");
        }
    });

    actualizarTotales();
    validarAsiento();
    actualizarVisibilidadTabla();

    $(document).on("click", ".btn-delete", function (e) {
        e.preventDefault();
        filaAEliminar = $(this).closest("tr");
        $("#confirmarEliminarModal").modal("show");
    });

    $("#btnConfirmarEliminar").on("click", function () {
        if (filaAEliminar) {
            filaAEliminar.remove();
            filaAEliminar = null;
            actualizarTotales();
            validarAsiento();
        }
        $("#confirmarEliminarModal").modal("hide");
    });

    $(document).on("click", ".btn-edit", function (e) {
        e.preventDefault();
        filaAEditar = $(this).closest("tr");
        var $td = filaAEditar.find("td");

        var moneda = $td.eq(2).text();

        if (moneda === "USD" && $td.eq(11).text() === "-") {
            $("#descripcionCuentaTipo1").val($td.eq(1).text());
            $("#oficinaTipo1").val($td.eq(3).text());
            $("#descripcionMovimientoTipo1").val($td.eq(4).text());
            $("#valorMovimientoTipo1").val($td.eq(7).text() !== "0.00" ? $td.eq(7).text() : $td.eq(8).text());
            $("#tipoMovimientoTipo1").val($td.eq(7).text() !== "0.00" ? "debito" : "credito");
            $(".nav-pills li:eq(0) a").tab("show");
        }
        else if (moneda === "EUR") {
            $("#descripcionCuentaTipo2").val($td.eq(1).text());
            $("#oficinaTipo2").val($td.eq(3).text());
            $("#descripcionMovimientoTipo2").val($td.eq(4).text());
            $("#valorMNtipo2").val($td.eq(7).text() !== "0.00" ? $td.eq(7).text() : $td.eq(8).text());
            $("#valorMEtipo2").val($td.eq(9).text() !== "0.00" ? $td.eq(9).text() : $td.eq(10).text());
            $("#tipoMovimientoTipo2").val($td.eq(7).text() !== "0.00" ? "debito" : "credito");
            $(".nav-pills li:eq(1) a").tab("show");
        }
        else {
            $("#descripcionCuentaTipo3").val($td.eq(1).text());
            $("#oficinaTipo3").val($td.eq(3).text());
            $("#descripcionMovimientoTipo3").val($td.eq(4).text());
            $("#motivoTipo3").val($td.eq(11).text());
            $("#valorMovimientoTipo3").val($td.eq(7).text() !== "0.00" ? $td.eq(7).text() : $td.eq(8).text());
            $("#tipoMovimientoTipo3").val($td.eq(7).text() !== "0.00" ? "debito" : "credito");
            $(".nav-pills li:eq(2) a").tab("show");
        }

        $("#detalleAsientoModal").modal("show");
    });

    $("#btnGrabarAsiento").on("click", function () {
        var filas = $(".detalle-asientos tbody tr").length;

        if (filas < 2) {
            mostrarMensaje("Debe ingresar al menos 2 registros en el asiento");
            return;
        }

        var totalDebitoMN = 0, totalCreditoMN = 0, totalDebitoME = 0, totalCreditoME = 0;

        $(".detalle-asientos tbody tr").each(function () {
            var $td = $(this).find("td");
            totalDebitoMN += parseFloat($td.eq(7).text()) || 0;
            totalCreditoMN += parseFloat($td.eq(8).text()) || 0;
            totalDebitoME += parseFloat($td.eq(9).text()) || 0;
            totalCreditoME += parseFloat($td.eq(10).text()) || 0;
        });

        if (totalDebitoMN.toFixed(2) !== totalCreditoMN.toFixed(2) ||
            totalDebitoME.toFixed(2) !== totalCreditoME.toFixed(2)) {
            mostrarMensaje("El asiento contable está descuadrado. Revise los valores");
            return;
        }

        var oficinaPrincipal = $(".panel-body select.form-control").eq(1).val();
        var oficinaCoincide = false;

        $(".detalle-asientos tbody tr").each(function () {
            var oficinaFila = $(this).find("td").eq(3).text();
            if (oficinaFila === oficinaPrincipal) {
                oficinaCoincide = true;
            }
        });

        if (!oficinaCoincide) {
            mostrarMensaje("Debe existir al menos un registro con la misma oficina seleccionada en la cabecera");
            return;
        }

        $(".panel-body input.form-control").eq(0).val("1");
        $("#asientoExitoModal").modal("show");
        $("#btnAgregarDetalle").hide();
        $("#btnGrabarAsiento").hide();
        $(".btn-edit").prop("disabled", true);
        $(".btn-delete").prop("disabled", true);
        $("#btnNuevoAsiento").show();
    });

    function resetearAsiento() {
        $(".detalle-asientos tbody").empty();
        actualizarVisibilidadTabla();
        $("#totalDebitoMN, #totalCreditoMN, #totalDebitoME, #totalCreditoME")
            .text("0.00");
        $("#leyendaAsiento").removeClass("ok error").text("");
        $(".panel-body input.form-control").eq(0).val("");
        $(".panel-body select.form-control").prop("selectedIndex", 0);
        $("#btnAgregarDetalle").show().prop("disabled", false);
        $("#btnGrabarAsiento").show().prop("disabled", false);
        $(".btn-edit, .btn-delete").prop("disabled", false);
        $("#btnNuevoAsiento").hide();
    }

    $("#btnNuevoAsiento").on("click", function () {
        resetearAsiento();
    });
});

//SOLICITUD INGRESO DE ASIENTOS OPERATIVOS
$(document).ready(function () {
    $("#departamentoOperativo").on("change", function () {
        var valor = $(this).val();
        var descripcion = "...";

        switch (valor) {
            case "AC":
                descripcion = "Departamento de Acciones";
                break;
            case "CC":
                descripcion = "Departamento de Credito";
                break;
            case "FI":
                descripcion = "Departamento de Finanzas";
                break;
            default:
                descripcion = "...";
        }

        $("#descripcionOperativo").val(descripcion);
    });

    $("#departamentoOperativo").trigger("change");

    function actualizarBotonesEliminar() {
        var $filas = $(".detalle-asientosOperativos tbody tr");
        if ($filas.length === 1) {
            $filas.find(".btn-magenta").prop("disabled", true);
        } else {
            $filas.find(".btn-magenta").prop("disabled", false);
        }
    }

    $(document).on("change", ".tipo-selector", function () {
        var opcion = $(this).val();
        var $fila = $(this).closest("tr");

        $fila.find("input, select").prop("disabled", false);

        if (opcion === "110101") {
            $fila.find("td:nth-child(2) input").prop("disabled", true).val("EFECTIVO BOVEDA");
            $fila.find("td:nth-child(4) input").prop("disabled", true).val("USD");
            $fila.find("td:nth-child(5) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(6) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(7) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(9) input").val("DETALLE 1");
            $fila.find("td:nth-child(10) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(11) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(12) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(15) input").prop("disabled", true).val("");
        }
        else if (opcion === "220202") {
            $fila.find("td:nth-child(2) input").prop("disabled", true).val("CASH TODAY");
            $fila.find("td:nth-child(4) input").prop("disabled", true).val("EUR");
            $fila.find("td:nth-child(5) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(6) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(7) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(9) input").val("DETALLE 2");
            $fila.find("td:nth-child(10) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(11) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(12) input").prop("disabled", true).val("");
        }
        else if (opcion === "330303") {
            $fila.find("td:nth-child(2) input").prop("disabled", true).val("OTRA CUENTA");
            $fila.find("td:nth-child(4) input").prop("disabled", true).val("USD");
            $fila.find("td:nth-child(5) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(9) input").val("DETALLE 3");
            $fila.find("td:nth-child(10) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(11) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(12) input").prop("disabled", true).val("");
            $fila.find("td:nth-child(15) input").prop("disabled", true).val("");
        }

        actualizarBotonesEliminar();
    });

    $(document).on("keydown", ".detalle-asientosOperativos tbody tr td:nth-child(14) input, .detalle-asientosOperativos tbody tr td:nth-child(15) input", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            var $fila = $(this).closest("tr");

            if ($fila.is(":last-child")) {
                var $nuevaFila = $fila.clone();

                $nuevaFila.find("input").val("").prop("disabled", false);
                $nuevaFila.find("select").val("").prop("disabled", false);

                $nuevaFila.find("button").prop("disabled", false);

                $(".detalle-asientosOperativos tbody").append($nuevaFila);

                actualizarBotonesEliminar();
                actualizarTotalesOperativos();
            }
        }
    });

    var filaAEliminarOperativo = null;

    $(document).on("click", ".detalle-asientosOperativos .btn-magenta", function () {
        filaAEliminarOperativo = $(this).closest("tr");
        $("#confirmarEliminarModalOperativo").modal("show");
    });

    function actualizarTotalesOperativos() {
        var totalDebitoMN = 0, totalDebitoME = 0;
        var totalCreditoMN = 0, totalCreditoME = 0;

        $(".detalle-asientosOperativos tbody tr").each(function () {
            var tipo = $(this).find("td:nth-child(3) select").val();
            var valorMN = parseFloat($(this).find("td:nth-child(14) input").val()) || 0;
            var valorME = parseFloat($(this).find("td:nth-child(15) input").val()) || 0;

            if (tipo === "2") {
                totalDebitoMN += valorMN;
                totalDebitoME += valorME;
            } else if (tipo === "1") {
                totalCreditoMN += valorMN;
                totalCreditoME += valorME;
            }
        });

        $("#totalDebitoMN").text(totalDebitoMN.toFixed(2));
        $("#totalDebitoME").text(totalDebitoME.toFixed(2));
        $("#totalCreditoMN").text(totalCreditoMN.toFixed(2));
        $("#totalCreditoME").text(totalCreditoME.toFixed(2));
    }

    $(document).on("change keyup", ".detalle-asientosOperativos tbody tr select, .detalle-asientosOperativos tbody tr input", function () {
        actualizarTotalesOperativos();
    });

    $("#btnConfirmarEliminar").on("click", function () {
        if (filaAEliminarOperativo) {
            filaAEliminarOperativo.remove();
            filaAEliminarOperativo = null;
        }
        $("#confirmarEliminarModalOperativo").modal("hide");
        actualizarBotonesEliminar();
        actualizarTotalesOperativos();
    });

    actualizarBotonesEliminar();
    actualizarTotalesOperativos();

    // Modal de mensajes reutilizable
    function mostrarMensaje(mensaje) {
        $("#mensajeModalTexto").text(mensaje);
        $("#mensajeModal").modal("show");
    }

    // Guardar asiento
    $(document).on("click", "#btnGrabarAsientoOperativo", function () {
        var $filas = $(".detalle-asientosOperativos tbody tr");
        if ($filas.length < 2) {
            mostrarMensaje("Debe haber al menos 2 registros en la tabla.");
            return;
        }

        var totalDebitoMN = parseFloat($("#totalDebitoMN").text()) || 0;
        var totalCreditoMN = parseFloat($("#totalCreditoMN").text()) || 0;
        var totalDebitoME = parseFloat($("#totalDebitoME").text()) || 0;
        var totalCreditoME = parseFloat($("#totalCreditoME").text()) || 0;

        if (totalDebitoMN !== totalCreditoMN || totalDebitoME !== totalCreditoME) {
            mostrarMensaje("Los totales no cuadran. Verifique los valores en Debito y Credito.");
            return;
        }

        var valido = true;
        $filas.each(function () {
            var cuenta = $(this).find("td:first select").val();
            var motivo = $(this).find("td:nth-child(5) input").val().trim();
            var producto = $(this).find("td:nth-child(6) input").val().trim();
            var ccosto = $(this).find("td:nth-child(7) input").val().trim();
            var valorMN = parseFloat($(this).find("td:nth-child(14) input").val()) || 0;
            var valorME = parseFloat($(this).find("td:nth-child(15) input").val()) || 0;

            if (cuenta === "110101" && valorMN <= 0) {
                mostrarMensaje("La cuenta 110101 requiere un valor en MN.");
                valido = false; return false;
            }
            if (cuenta === "220202" && (valorMN <= 0 || valorME <= 0)) {
                mostrarMensaje("La cuenta 220202 requiere valores en MN y ME.");
                valido = false; return false;
            }
            if (cuenta === "330303" && valorMN <= 0) {
                mostrarMensaje("La cuenta 330303 requiere un valor en MN.");
                valido = false; return false;
            }
            if (cuenta === "330303" && !motivo && !producto && !ccosto) {
                mostrarMensaje("La cuenta 330303 requiere al menos un valor en Motivo, Producto o C. Costo.");
                valido = false; return false;
            }
        });
        if (!valido) return;

        var oficinaCabecera = $("#oficinaOperativo").val();
        var coincideOficina = false;

        $filas.each(function () {
            var oficinaFila = $(this).find("td:nth-child(8) select").val();
            if (oficinaFila === oficinaCabecera) {
                coincideOficina = true;
                return false;
            }
        });

        if (!coincideOficina) {
            mostrarMensaje("Debe existir al menos una fila cuyo 'Of. Mov' coincida con la oficina seleccionada en la cabecera.");
            return;
        }

        // si pasa todas las validaciones
        var numeroAsiento = Math.floor(Math.random() * 900000) + 100000;
        $("#numeroAsientoExito").text(numeroAsiento);
        $("#asientoExitoModalOperativo").modal("show");

        // reset al cerrar modal
        $("#asientoExitoModalOperativo").one("hidden.bs.modal", function () {
            $("#departamentoOperativo").val("AC").trigger("change");
            $("#descripcionOperativo").val("Departamento de Acciones");

            var $tbody = $(".detalle-asientosOperativos tbody");
            $tbody.empty();

            var $filaNueva = `
        <tr>
            <td>
                <select class="form-control tipo-selector">
                    <option value="">---</option>
                    <option value="110101">110101</option>
                    <option value="220202">220202</option>
                    <option value="330303">330303</option>
                </select>
            </td>
            <td><input type="text" class="form-control" /></td>
            <td>
                <select class="form-control">
                    <option value="1">CREDITO</option>
                    <option value="2">DEBITO</option>
                </select>
            </td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td>
                <select class="form-control">
                    <option>001 - MATRIZ</option>
                    <option>002 - SUCURSAL NORTE</option>
                    <option>003 - SUCURSAL SUR</option>
                </select>
            </td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="text" class="form-control" /></td>
            <td><input type="number" class="form-control text-right" /></td>
            <td><input type="number" class="form-control text-right" /></td>
            <td class="text-center">
                <button type="button" class="btn btn-xs btn-magenta" disabled>
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
            </td>
        </tr>`;
            $tbody.append($filaNueva);

            $("#totalDebitoMN, #totalDebitoME, #totalCreditoMN, #totalCreditoME").text("0.00");

            actualizarBotonesEliminar();
        });
    });
});
