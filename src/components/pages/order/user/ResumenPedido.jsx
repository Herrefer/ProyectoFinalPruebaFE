import React, { createContext, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { crearOrdenMP, crearPedidoApi } from "../../../../helpers/queries";
import Swal from "sweetalert2";
import { METODO_ENVIO } from "../../../../helpers/constants";
// import 'dotenv/config';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
// import { accessToken } from "../../../../helpers/constants";

// const accessToken = import.meta.env.MP_TOKEN_ACCESS;


const ResumenPedido = ({
  carrito,
  montoCarrito,
  productosCarrito,
  usuarioLogeado,
  setCarrito,
}) => {
  const [metodoEnvio, setMetodoEnvio] = useState(1);

  //MERCADOPAGO
  
  // console.log(accessToken);

  const [preferenceId, setPreferenceId] = useState(null);
  // const walletContext = createContext(preferenceId);
  //

  const confirmarPedido = async () => {
    let carritoAux = [...carrito];
    let productosPedido = [];
    let pedido = new Object();
    let usuario = usuarioLogeado.id;

    let fecha = new Date().toLocaleString();

    for (let i = 0; i < carritoAux.length; i++) {
      let producto = productosCarrito.find(
        (productoCarrito) => productoCarrito._id == carritoAux[i].producto
      );
      let productoCarrito = {
        id: crypto.randomUUID(),
        producto: producto,
        cantidad: carritoAux[i].cantidad,
      };
      productosPedido.push(productoCarrito);
    }

    pedido.usuario = usuario;
    pedido.monto = montoCarrito;
    pedido.productos = productosPedido;
    pedido.metodoEnvio = metodoEnvio;
    pedido.estadoEnvio = false;
    pedido.fecha = fecha;

    //MERCADO PAGO
    
    // const respuesta = await crearOrdenMP(objetoOrdenMP);
    // console.log(respuesta.result);
    // setPreferenceId(respuesta.result);
    // sessionStorage.setItem("pedidoNuevoMP", respuesta.result);
    // console.log(preferenceId);
    //
    // const crearPedidoVar = await crearPedidoApi(pedido);
    // if (crearPedidoVar.ok) {
    //   sessionStorage.removeItem("carrito");
    //   setCarrito([]);
    //   Swal.fire({
    //     icon: "success",
    //     title: "Su pedido fue generado con exito.",
    //   });
    // } else {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Su pedido no fue generado, vuelva a intentarlo.",
    //   });
    // }


    const objetoOrdenMP = { title: pedido.usuario, unit_price: pedido.monto };
    const respuesta = await crearOrdenMP(objetoOrdenMP);       
    console.log(respuesta);
    console.log(respuesta.preferenceID);
    setPreferenceId(respuesta.preferenceID);
    console.log(preferenceId)

    initMercadoPago(respuesta.publicKey, {
      locale: "es-AR",
    });
    // console.log(respuesta.init_point)
  };

  console.log(preferenceId)

  return (
    <div className="resumeCardContainer">
      <div className="resumeCard my-5">
        <Card className="text-dark">
          <CardHeader>
            <CardTitle className="mt-2 fw-bold">Detalles del pedido</CardTitle>
          </CardHeader>
          <CardBody>
            {METODO_ENVIO.map((check) => (
              <div className="my-2 d-flex" key={check.id}>
                <input
                  type="radio"
                  name="grup"
                  checked={check.id == metodoEnvio}
                  className="mx-2"
                  value={check.id}
                  onChange={(event) =>
                    setMetodoEnvio(Number(event.target.value))
                  }
                />
                <label htmlFor="delivery">{check.tipo}</label>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3 fw-bold">
              <span>Total</span>
              <span>${montoCarrito}</span>
            </div>
            <hr className="mt-0" />
          </CardBody>
          <CardFooter>
            <div className="d-flex justify-content-center">
              {productosCarrito.length > 0 ? (
                <>
                  <div className="d-flex flex-column">
                    <Button
                      onClick={confirmarPedido}
                      className="w-100 fw-bold"
                      variant="success"
                    >
                      Confirmar Pedido
                    </Button>
                    {preferenceId && (
                      <Wallet
                        initialization={{
                          preferenceId: preferenceId,
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <Link></Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResumenPedido;