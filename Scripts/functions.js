$(document).ready(function () {
    $('.nav .dropdown').hover(
        function () { $(this).addClass('open'); },
        function () { $(this).removeClass('open'); }
    );

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
                .text("El asiento está cuadrado (MN y ME)");
        } else if (!cuadradoMN && cuadradoME) {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento está descuadrado en MN (Débito: " + totalDebitoMN.toFixed(2) +
                    "  Crédito: " + totalCreditoMN.toFixed(2) + ")");
        } else if (cuadradoMN && !cuadradoME) {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento está descuadrado en ME (Débito: " + totalDebitoME.toFixed(2) +
                    "  Crédito: " + totalCreditoME.toFixed(2) + ")");
        } else {
            $("#leyendaAsiento").removeClass("ok").addClass("error")
                .text("El asiento está descuadrado en MN y ME");
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
            $("#detalleAsientoModal").modal("hide");
        }
    });

    actualizarTotales();
    validarAsiento();

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
