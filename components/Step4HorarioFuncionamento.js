import React from "react";
import { CalendarDays, Clock, Copy } from "lucide-react";

const Step4HorarioFuncionamento = ({ form, setForm, weekDays }) => {
  // Alterna se o dia está ativo ou não
  const toggleDay = (dayKey) => {
    setForm((f) => ({
      ...f,
      schedule: {
        ...f.schedule,
        [dayKey]: {
          ...f.schedule[dayKey],
          enabled: !f.schedule[dayKey].enabled,
        },
      },
    }));
  };

  // Atualiza hora de abertura/fechamento
  const updateHour = (dayKey, field, value) => {
    setForm((f) => ({
      ...f,
      schedule: {
        ...f.schedule,
        [dayKey]: {
          ...f.schedule[dayKey],
          [field]: value,
        },
      },
    }));
  };

  // Copia horário de segunda para todos os dias ativos
  const copyToAll = (baseDayKey) => {
    const baseDay = form.schedule[baseDayKey];
    if (!baseDay) return;

    const updatedSchedule = {};
    Object.keys(form.schedule).forEach((dayKey) => {
      updatedSchedule[dayKey] = {
        ...form.schedule[dayKey],
        open: baseDay.open,
        close: baseDay.close,
      };
    });

    setForm((f) => ({
      ...f,
      schedule: updatedSchedule,
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CalendarDays className="w-6 h-6 mr-3 text-orange-500" />
        Horários & Funcionamento
      </h2>

      <div className="space-y-8">
        {/* Seção de horários por dia */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Defina os horários por dia
          </h3>

          {/* Botão opcional para copiar horário da segunda para todos os dias ativos */}
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => copyToAll("segunda")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar horário de segunda para todos os dias ativos
            </button>
          </div>

          <div className="space-y-3">
            {weekDays.map((d) => {
              const day = form.schedule[d.key];
              const enabled = !!day?.enabled;
              return (
                <div
                  key={d.key}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    enabled
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Cabeçalho do dia + switch */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          enabled
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => toggleDay(d.key)}
                      >
                        {enabled && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span
                        className="font-medium text-gray-800 cursor-pointer select-none"
                        onClick={() => toggleDay(d.key)}
                      >
                        {d.label}
                      </span>
                    </div>

                    {/* Inputs de horário */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:w-1/2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Abertura
                        </label>
                        <input
                          type="time"
                          disabled={!enabled}
                          value={day.open}
                          onChange={(e) =>
                            updateHour(d.key, "open", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            enabled
                              ? "border-gray-200 bg-gray-50/50"
                              : "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Fechamento
                        </label>
                        <input
                          type="time"
                          disabled={!enabled}
                          value={day.close}
                          onChange={(e) =>
                            updateHour(d.key, "close", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            enabled
                              ? "border-gray-200 bg-gray-50/50"
                              : "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4HorarioFuncionamento;
