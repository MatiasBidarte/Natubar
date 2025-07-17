'use client'
import { useEffect, useState } from "react";
import usePedidos from "../hooks/usePedidos";
import { EstadosPedido } from "../types/pedido";
import { Alert, Box, Button, CircularProgress, Collapse, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import { formatDateToLocalDate, formatDateToString } from "../utils/date";
import Image from "next/image";
import { AccessTime, CalendarMonth, KeyboardArrowDown, KeyboardArrowUp, LocalShipping } from "@mui/icons-material";
import { Cliente } from "../hooks/useClientes";

const ListaPedidosPage = () => {
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadosPedido>(EstadosPedido.enPreparacion);
    const [expandedPedidos, setExpandedPedidos] = useState<Record<number, boolean>>({});
    const {
        pedidosEnCurso,
        pedidosFinalizados,
        loadingPedidos,
        errorPedidos,
        fetchPedidos
    } = usePedidos();
    const [usuario, setUsuario] = useState<Cliente>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const usuarioData = localStorage.getItem("usuario");
                if (usuarioData) {
                    const usuario = JSON.parse(usuarioData);
                    setUsuario(usuario);
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        }
    }, []);

    const handleEstadoClick = (estado: EstadosPedido) => {
        setEstadoSeleccionado(estado);
        fetchPedidos(estado)

    };

    const togglePedidoExpand = (id: number) => {
        setExpandedPedidos(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const pedidosFiltrados = [...pedidosEnCurso, ...pedidosFinalizados].filter(
        (p) => p.estado === estadoSeleccionado
    );

    const getStatusColor = (estado: EstadosPedido) => {
        switch (estado) {
            case EstadosPedido.enPreparacion:
                return "bg-amber-400 text-[#201B21]";
            case EstadosPedido.pendientePago:
                return "bg-amber-300 text-[#201B21]";
            case EstadosPedido.enCamino:
                return "bg-blue-400 text-white";
            case EstadosPedido.entregado:
                return "bg-green-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    const getStatusIcon = (estado: EstadosPedido) => {
        switch (estado) {
            case EstadosPedido.enPreparacion:
            case EstadosPedido.pendientePago:
                return <AccessTime className="mr-1" fontSize="small" />;
            case EstadosPedido.enCamino:
                return <LocalShipping className="mr-1" fontSize="small" />;
            case EstadosPedido.entregado:
                return <CalendarMonth className="mr-1" fontSize="small" />;
            default:
                return null;
        }
    };

    if (errorPedidos) {
        return (
            <Alert severity="error" className="my-6 rounded-lg">
                {errorPedidos}
            </Alert>
        );
    }


    if (loadingPedidos) {
        return (
            <Box className="flex justify-center my-12">
                <CircularProgress sx={{ color: '#B99342' }} />
            </Box>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                minHeight: 500,
                maxWidth: { xs: '95vw', sm: '90vw', md: '85vw', lg: '70vw' },
                mx: 'auto',
                p: { xs: 1, sm: 2, md: 3 },
            }}
        >
            {/* Filtro por estado */}
            <Stack direction="row" spacing={2} className="mb-4">
                {Object.values(EstadosPedido).map((estado) => (
                    <Button
                        key={estado}
                        variant={estadoSeleccionado === estado ? 'contained' : 'outlined'}
                        onClick={() => handleEstadoClick(estado)}
                    >
                        {estado}
                    </Button>
                ))}
            </Stack>

            {/* Render de pedidos detallado */}
            {pedidosFiltrados.length === 0 ? (
                <Typography>No hay pedidos para este estado.</Typography>
            ) : (
                pedidosFiltrados.map((pedido) => {
                    const primerProducto = pedido.productos?.[0] ?? null;
                    const isExpanded = expandedPedidos[pedido.id] || false;

                    return (
                        <Paper key={pedido.id} elevation={1} className="mb-5 rounded-xl overflow-hidden">
                            {/* Encabezado */}
                            <Box className="flex justify-between items-center p-4 bg-[#FFF9ED]">
                                <Box>
                                    <Typography variant="subtitle1" className="font-bold">
                                        Cliente: {pedido.cliente?.email}
                                    </Typography>
                                    <Typography variant="subtitle1" className="font-bold">
                                        Pedido del {formatDateToString(pedido.fechaCreacion)}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-500">
                                        {pedido.fechaEntrega
                                            ? `Entregado el: ${formatDateToLocalDate(pedido.fechaEntrega)}`
                                            : `Entrega estimada: ${formatDateToLocalDate(pedido.fechaEntregaEstimada)}`}
                                    </Typography>
                                </Box>
                                <Box>
                                    <span className={`px-3 py-1 rounded-full ${getStatusColor(pedido.estado)}`}>
                                        {getStatusIcon(pedido.estado)}
                                        {pedido.estado}
                                    </span>
                                </Box>
                            </Box>

                            {/* Resumen */}
                            <Box className="p-4 bg-white flex justify-between cursor-pointer" onClick={() => togglePedidoExpand(pedido.id)}>
                                <Box className="flex items-center">
                                    {primerProducto?.producto.urlImagen && primerProducto?.producto.nombre && (
                                        <Box className="w-16 h-16 mr-4 rounded-lg overflow-hidden relative">
                                            <Image src={primerProducto.producto.urlImagen} alt={primerProducto.producto.nombre} fill className="object-cover" />
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography variant="body1" className="font-medium">
                                            {primerProducto?.producto.nombre ?? 'Pedido'}
                                        </Typography>
                                        {pedido.productos && pedido.productos?.length > 1 && (
                                            <Typography variant="body2" className="text-gray-500">
                                                + {pedido.productos.length - 1} productos más
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Box className="flex flex-col items-start">
                                    <Box className="flex items-center justify-between w-full mb-2">
                                        <Typography variant="subtitle1" className="font-bold">
                                            ${pedido.montoTotal.toFixed(2)}
                                        </Typography>
                                        <IconButton size="small">
                                            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </Box>
                                </Box>

                            </Box>

                            {/* Detalle expandido */}
                            <Collapse in={isExpanded}>
                                <Box className="p-4 pt-0 bg-white border-t border-gray-100">
                                    {pedido.productos?.map((item, index) => (
                                        <Box key={index} className="py-3 border-b border-gray-100 last:border-b-0">
                                            <Box className="flex justify-between">
                                                <Typography className="font-medium">
                                                    {item.cantidad}x {item.producto.nombre}
                                                </Typography>
                                                <Typography>
                                                    ${usuario?.tipo === 'Persona'
                                                        ? (item.cantidad * item.producto.precioPersonas).toFixed(2)
                                                        : (item.cantidad * item.producto.precioEmpresas).toFixed(2)}
                                                </Typography>
                                            </Box>
                                            {item.productoSabores && item.productoSabores?.length > 0 && (
                                                <Box className="ml-4 mt-1">
                                                    <Typography variant="caption" className="text-gray-600">Sabores:</Typography>
                                                    <Box className="flex flex-wrap gap-1">
                                                        {item.productoSabores.map((sabor, idx) => (
                                                            <Typography key={idx} variant="caption" className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                                                {sabor.sabor.nombre} x{sabor.cantidad}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}

                                    {/* Total */}
                                    <Divider className="my-3" />
                                    <Box className="flex justify-between">
                                        <Typography variant="subtitle1" className="font-bold">Total</Typography>
                                        <Typography variant="subtitle1" className="font-bold">
                                            ${pedido.montoTotal.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    {pedido.estado == EstadosPedido.pendientePago &&
                                        <Box>
                                            <Button variant="outlined" size="small" sx={{margin:1}}>
                                                Recordar pago
                                            </Button>
                                                 <Button variant="outlined" size="small" sx={{margin:1}}>
                                                Finalizar pedido
                                            </Button>

                                        </Box>
                                    }
                                </Box>
                            </Collapse>
                        </Paper>
                    );
                })
            )}
        </Paper>
    );
};

export default ListaPedidosPage;