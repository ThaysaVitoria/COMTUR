import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarUsr from "../../components/user/navbarUsr.jsx";
import FooterUsr from "../../components/user/footerUsr.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { Funnel } from "@phosphor-icons/react";

export default function TodosEventos() {
  const { id } = useParams();
  const [OutrosTurismos, setOutrosTurismos] = useState([]);
  const [tiposTurismo, setTiposTurismo] = useState([]);
  const navigate = useNavigate();
  const baseUrl = "https://localhost:7256/api/Turismo";
  const baseUrlTipoTurismo = "https://localhost:7256/api/TipoTurismo";

  useEffect(() => {
    const obterOutrosTurismos = async () => {
      try {
        const response = await axios.get(`${baseUrl}`);
        setOutrosTurismos(
          response.data.filter(
            (OutrosTurismos) => OutrosTurismos.idTipoTurismo === 4 && OutrosTurismos.id !== parseInt(id) && OutrosTurismos.status === 2
          )
        );
      } catch (error) {
        console.error("Erro ao obter outros turismos:", error);
      }
    };

    const obterTiposTurismo = async () => {
      try {
        const response = await axios.get(`${baseUrlTipoTurismo}`);
        setTiposTurismo(response.data);
      } catch (error) {
        console.error("Erro ao obter tipos de turismo:", error);
      }
    };

    obterOutrosTurismos();
    obterTiposTurismo();
  }, [id]);

  // Função para encontrar o nome do tipo de turismo pelo ID
  const obterNomeTipoTurismo = (idTipoTurismo) => {
    const tipo = tiposTurismo.find((tipo) => tipo.id === idTipoTurismo);
    return tipo ? tipo.nome : "Tipo não encontrado";
  };

  return (
    <div>
      <NavbarUsr />
      <div className="flex flex-col px-4 sm:pl-24 sm:pr-24">
        <h1 className="text-[#373636] mb-3 text-lg font-extrabold pt-4 sm:pt-14 sm:px-16 sm:text-4xl">Eventos</h1>
      </div>

      <hr className="pb-4 border-[1.5px] border-black  w-75 ml-auto" />

      <div className="container">
        {/*<div className="flex items-center space-x-4">
          <div className="inline-flex items-center">
            <label htmlFor="filtroTipoTurismo" className="mr-2"></label>
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <Funnel size={18} />
              </span>
              <select
                className="form-select rounded-none h-10 w-40 "
                disabled // Desabilitando o filtro, já que queremos apenas o tipo 4
              >
                <option value="4">Tipo Turismo: Evento</option>
              </select>
            </div>
          </div>
        </div> */}

        <div className="container">
          <div className="flex justify-center pb-2 pt-4 items-center">
            <div className=" pb-2 px-2 text-xs sm:pl-32 sm:pr-32 sm:min-w-[320px] lg:w-[90%] xl:w-[80%] 2xl:w-[70%]">
            {OutrosTurismos.map((OutrosTurismos) => (
                <div key={OutrosTurismos.id} className="pb-3 px-4">
                  <div className="grid grid-cols-2 h-[140px] sm:h-[300px] border-2 border-[#DBDBDB]">
                    {OutrosTurismos.imagemTurismo[0] && (
                      <img
                        src={OutrosTurismos.imagemTurismo[0]?.imagem}
                        alt="Preview"
                        className="flex w-full h-[136px] sm:h-[290px]"
                      />
                    )}
                  <div className="pl-6 pt-2">
                    <h2 className=" truncate pr-6 text-[#373636] text-ellipsis overflow-hidden font-semibold text-xs sm:text-base uppercase">
                      {OutrosTurismos.nome}
                    </h2>
                    <h2 className="truncate pr-6 pt-1 text-[#373636] font-normal text-xs sm:text-bas">
                      {OutrosTurismos.endereco}
                    </h2>

                    <div className="flex">
                      <button
                        className="mt-6 bg-[#FFD121] text-xs sm:text-bas text-[#373636]
                   font-medium hover:bg-black hover:text-white w-20 h-6 sm:w-32 sm:h-10"
                        onClick={() => {
                          navigate(`/visualizarTurismo/${OutrosTurismos.id}`);
                          window.location.reload();
                        }}
                      >
                        Leia Mais
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute bottom-0 right-0">
                    <div
                      className="flex justify-center items-center text-[10px]
                 sm:text-xs text-[#373636] font-medium bg-[#FFD121]
                 w-20 h-4 sm:w-32 sm:h-8"
                    >
                      {obterNomeTipoTurismo(OutrosTurismos.idTipoTurismo)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
      <FooterUsr />
    </div>
  );
}
