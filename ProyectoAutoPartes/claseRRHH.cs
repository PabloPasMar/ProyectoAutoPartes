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
using System.Globalization;

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

        public void AgregarEmpleado(string dpiEmpleado, string nombre, DateTime fechaNacimiento, string rol, 
                                string cuentaBancaria, string usuario, string contrase�a, int faltas, double bonos, double salario)
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                string query = "INSERT INTO RRHH (DPI_Empleado, ID_Empleado, Nombre, " +
                              "FechaDeNacimiento, Rol, CuentaBancaria, Usuario, Contrase�a, Faltas, Bonos, Salario) " +
                              "VALUES (@DPI, @ID, @Nombre, @Fecha, @Rol, @Cuenta, @Usuario, @Password, @Faltas, @Bonos, @Salario)";

                MySqlCommand command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@DPI", dpiEmpleado);
                command.Parameters.AddWithValue("@Nombre", nombre);
                command.Parameters.AddWithValue("@Fecha", fechaNacimiento);
                command.Parameters.AddWithValue("@Rol", rol);
                command.Parameters.AddWithValue("@Cuenta", cuentaBancaria);
                command.Parameters.AddWithValue("@Usuario", usuario);
                command.Parameters.AddWithValue("@Password", contrase�a);
                command.Parameters.AddWithValue("@Faltas", faltas);
                command.Parameters.AddWithValue("@Bonos", bonos);
                command.Parameters.AddWithValue("@Salario", salario);

                try
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                    MessageBox.Show("Empleado agregado con �xito!");
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error al agregar empleado: " + ex.Message);
                }
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

        public double Salario()
        {
            string input = Interaction.InputBox("Ingrese el salario del empleado", "Inscripci�n Empleado", "");

            if (double.TryParse(input, out double salario))
            {
                MessageBox.Show("Salario agregado correctamente", "Inscripci�n de empleado", MessageBoxButtons.OK);
                return salario; // Retorna el salario v�lido
            }
            else
            {
                MessageBox.Show("Ingrese un n�mero v�lido para el salario (entero o con dos decimales)", "Inscripci�n de empleado", MessageBoxButtons.OK);
                return Salario(); // Vuelve a pedir el salario hasta que sea v�lido
            }
        }

        public bool EsFechaValida(string fecha)
        {
            DateTime fechaConvertida;
            return DateTime.TryParseExact(fecha, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaConvertida);
        }
    }
}