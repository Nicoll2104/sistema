import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDiaria2Store = defineStore('diaria2', () =>{
    const diaria2 = ref([])

    const obtenerInfoDiaria2 = async () =>{
        try{
            let responseDiaria2 = await axios.get('diaria2/ver');
            return responseDiaria2.data;
        } catch(error){
            throw error;
        }
    };

    const postDiaria2 = async (data) =>{
        try{
            let res = await axios.post("diaria2/agregar");
            return res.data;
        } catch (error){
            return error.response.data;
        }
    };

    const putDiaria2 = async (id, data) => {
        try{
            let res = await axios.put("diaria2/modificar");
            return res;
        }catch (error){
            return error.response.data
        }
    };

    return{
        diaria2,
        obtenerInfoDiaria2,
        postDiaria2,
        putDiaria2
    }
})