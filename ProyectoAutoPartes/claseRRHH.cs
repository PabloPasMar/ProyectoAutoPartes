using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices.Marshalling;
using System.Text;
using Microsoft.VisualBasic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Windows.Forms;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProyectoAutoPartes
{
    public class claseGestionRRHH
    {
        //Direcci�n de la base de datos 
        private string connectionString = "D:\\Base de datos VB\\ProyectoAutoPartes\\Avamce.... de proyecto.prueba6.mwb";

        private formMenu form;

        // Constructor con inyecci�n de dependencias
        public claseGestionRRHH(string connectionString, formMenu form)
        {
            this.connectionString = connectionString;
            this.form = form;
        }

        public bool VerificarUsuario(string usuario, string contrase�a)
        {
            bool accesoPermitido = false;

            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                string query = "SELECT Contrase�a FROM Empleados WHERE Usuario = @usuario";

                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@usuario", usuario);

                    conn.Open();
                    object resultado = cmd.ExecuteScalar(); // Obtiene la contrase�a almacenada

                    if (resultado != null)
                    {
                        string contrase�aGuardada = resultado.ToString();

                        // Comparar contrase�as (si usas hashing, aqu� aplicar�as la verificaci�n)
                        if (contrase�a == contrase�aGuardada)
                        {
                            accesoPermitido = true;
                        }
                    }
                }
            }

            return accesoPermitido;
        }

        public void BuscarEmpleado()
        {
            string nombre = Interaction.InputBox("Cual es el nombre del empleado", "Busqueda de empleados", "");
        }

        public void AgregarEmpleado(string DPI, string NombreEmpleado, string Rol, string CuentaBancaria, string Usuario, string Contrase�a)
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    string query = "INSERT INTO inventario (NombreProducto, Descripcion, Costo, Ganancia, CantidadEnStock) VALUES (@nombre, @descripcion, @costo, @ganancia, @stock)";
                    using var cmd = new MySqlCommand(query, conn);

                    // Se asignan los valores a los par�metros
                    cmd.Parameters.AddWithValue("@nombre", nombre);
                    cmd.Parameters.AddWithValue("@descripcion", descripcion);
                    cmd.Parameters.AddWithValue("@costo", costo);
                    cmd.Parameters.AddWithValue("@ganancia", ganancia);
                    cmd.Parameters.AddWithValue("@stock", stock);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                    conn.Close();

                    MessageBox.Show("Datos insertados correctamente.", "�xito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ocurri� un error al guardar los datos: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public void ModificarLlavesAcceso()
        {
            verificarUsuarioContrasenia verificarUsuario = new verificarUsuarioContrasenia();
            verificarUsuario.ShowDialog();

            usuarioContrasenia usuarioContrasenia = new usuarioContrasenia();
            usuarioContrasenia.ShowDialog();
        }

        public void SeleccionarNivel(string rol)
        {
            switch (rol)
            {
                case "a":
                    break;
                case "b":
                    break;
                case "c":
                    break;
                case "d":
                    break;
                case "e":
                    break;
            }
        }
    }
}