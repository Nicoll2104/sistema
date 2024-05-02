<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo" label="Codigo" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el codigo']"></q-input>
          <q-input class="input1" outlined v-model="data.usuario" label="Usuario" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el usuario']"></q-input>
          <q-input class="input1" outlined v-model="data.contrasena" label="Contrasena" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese la contrasena']"></q-input>
          <input type="file" @change="handleFileSelect" accept="image/*" class="input1">
          <q-input class="input1" outlined v-model="data.descripcion" label="Descripcion" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese la descripcion']"></q-input>
          <q-input class="input1" outlined v-model="data.programa" label="Programa" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el programa']"></q-input>
          <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0;">
            <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
              <q-icon name="cancel" color="white" right />
            </q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table dense :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones" auto-width>
            <q-btn color="warning" icon="edit" class="text-caption q-pa-sm q-mx-xs" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDiaria2Store } from "../stores/diaria2.js";
import { useQuasar } from 'quasar'

const modelo = "Diaria2";
const useDiaria2 = useDiaria2Store();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "codigo",
    label: "Codigo",
    align: "left",
    field: (row) => row.codigo,

  },
  {
    name: "Usuario",
    label: "usuario",
    align: "left",
    field: (row) => row.usuario
  },
  {
    name: "Contrasena",
    label: "contrasena",
    align: "left",
    field: (row) => row.contrasena
  },
  {
    name: "Imagen",
    label: "imagen",
    align: "left",
    field: (row) => row.imagen
  },
  {
    name: "Descripcion",
    label: "descripcion",
    align: "left",
    field: (row) => row.descripcion
  },
  {
    name: "Programa",
    label: "programa",
    align: "left",
    field: (row) => row.programa
  },
  {
    name: "opciones",
    label: "",
    field: "opciones",
    align: "center",
  },
]);
const rows = ref([]);

const data = ref({
  codigo: "",
  usuario: "",
  contrasena: "",
  imagen: "",
  descripcion: "",
  programa: "",
});

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      data.imagen = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const obtenerInfo = async () => {
  try {
    const diaria2 = await useDiaria2.obtenerInfoDiaria2();

    console.log(diaria2)

    if (!diaria2) return

    if (diaria2.error) {
      notificar('negative', diaria2.error)
      return
    }
    rows.value = diaria2


  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};


obtenerInfo();



const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      codigo: "",
      usuario: "",
      contrasena: "",
      imagen: "",
      descripcion: "",
      programa: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info }
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useDiaria2.postDiaria2(data.value);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(response);
      rows.value.unshift(response.diaria2);
      notificar('positive', 'Guardado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useDiaria2.putDiaria2(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.diaria2._id), 1, response.data.diaria2);
      notificar('positive', 'Editado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
};                                          


function validarCampos() {
  const arrData = Object.entries(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);


    if (d[0] === "codigo" && d[1].length > 10) {
      notificar('negative', 'El codigo no puede tener más de 10 caracteres');
      return;
    }
  }
  if (!data.imagen) {
    notificar('negative', 'Seleccione una imagen');
    return;
  }

  enviarInfo[estado.value]();
}


function notificar(tipo, msg) {
$q.notify({
  type: tipo,
  message: msg,
  position: "top"
})
}
</script>


<style scoped>



* {
  margin: 0px;
  padding: 0px;
}

.modal {
  width: 100%;
  max-width: 600px;
}

.tabla {
  padding: 0 20px;
  margin: 10px auto;
  max-width: 600px;
  /* min-height: 710px; */
  border: 0px solid black;
}

.titulo-cont {
  margin: auto;
}

.buscar {
  display: inline-block;
  margin: auto;
  margin-top: 8px;
  padding: 0px 15px;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 5px;
}

.encabezado {
  font-weight: bold;
  font-size: 15px;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}
</style>

