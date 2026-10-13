/**
 * Spanish content overlay: bodies of text, fetched when a route that renders
 * them is opened.
 *
 * The line between this file and translations.js is what the reader is
 * waiting on:
 *
 *   - read while painting, or by an effect that fires on mount, so it cannot
 *     wait for a fetch            -> translations.js
 *   - the body copy of one page, reachable only through its own lazy route,
 *     and absent until that route loads anyway -> here
 *
 * `translations.js` already carries the headings and labels of the legal and
 * documentation pages; these namespaces add their long `sections` bodies on
 * top, through the deep merge in LanguageContext.
 *
 * `courseData` and `quizzesData` are the bulk of it, and the reason the
 * overlay is per-language at all: they have no English counterpart, because
 * they translate the real content in `coursesData.js` and `quizData.js` and
 * `getLocalizedCourse` falls back to that source for any missing key. An
 * English visitor used to download all 41K gzip of them.
 *
 * The UI namespaces — nav, common, toasts, modals, quiz, contact, thankYou,
 * notFound — were in here briefly and caused a bug: deleting an account
 * reloads the home page and fires `toasts.profileDeleted` from an effect,
 * which ran before this module arrived and printed the key path at the
 * reader. They are 2.6K gzip and belong in the dictionary that exists before
 * the first paint. Do not move them back.
 *
 * See ./index.js for how this loads.
 */

const content = {
  privacy: {
    footerTitle: "¿Preguntas sobre tu privacidad?",
    footerPre: "Contáctanos en",
    footerEmail: "Escribir al Equipo de Privacidad",
    footerMid: "o revisa nuestros",
    footerTerms: "Términos de Servicio",
    sections: [
      { heading: "1. Introducción", body: ["Esta Política de Privacidad explica cómo Learntopia (\"nosotros\", \"nos\", \"nuestro\") recopila, usa, almacena y protege tu información cuando utilizas nuestro sitio web y servicios (el \"Servicio\"). Nos comprometemos a manejar tus datos de forma responsable y a recopilar únicamente lo necesario para ofrecer el Servicio.", "Al usar Learntopia, aceptas las prácticas descritas en esta política."] },
      { heading: "2. Información que Recopilamos", body: ["Recopilamos las siguientes categorías limitadas de información:"], list: ["Información de la cuenta — tu nombre visible y dirección de correo, proporcionados al registrarte o a través de tu cuenta de Google si usas el inicio de sesión con Google.", "Foto de perfil — solo cuando tu cuenta de Google la proporciona.", "Datos de aprendizaje — los cursos en los que te inscribes, tu progreso en módulos y cursos, tus intentos y puntuaciones de cuestionarios, y tu racha diaria de inicio de sesión.", "Datos técnicos — los tokens de sesión de autenticación necesarios para mantenerte conectado de forma segura."] },
      { heading: "3. Cómo Recopilamos la Información", body: ["Recopilamos información directamente de ti cuando creas una cuenta o usas funciones del Servicio, y automáticamente a medida que avanzas en cursos y cuestionarios. Si eliges iniciar sesión con Google, recibimos datos básicos del perfil (nombre, correo y foto) de Google según la configuración de tu cuenta de Google."] },
      { heading: "4. Cómo Usamos tu Información", body: ["Usamos tu información únicamente para operar y mejorar el Servicio, específicamente para:"], list: ["Crear y proteger tu cuenta y mantener tu sesión autenticada.", "Guardar y mostrar tus inscripciones a cursos, progreso y puntuaciones de cuestionarios en tu panel.", "Calcular y mostrar rachas diarias de inicio de sesión y clasificaciones.", "Proporcionar las funciones educativas principales de la plataforma.", "Mantener la seguridad, integridad y fiabilidad del Servicio."] },
      { heading: "5. Cómo Almacenamos y Protegemos tus Datos", body: ["Tus datos se almacenan usando Google Firebase — específicamente Firebase Authentication y la base de datos Cloud Firestore. El acceso se rige por estrictas reglas de seguridad del lado del servidor que garantizan que tu perfil, progreso y datos de cuestionarios solo puedan ser leídos y escritos por ti mientras estás autenticado.", "Los datos de la clasificación (solo nombre visible y puntuación total) se almacenan en una colección separada y pueden ser leídos por cualquier usuario autenticado. Tu correo electrónico, progreso de cursos e historial de cuestionarios nunca se exponen en la clasificación.", "Tomamos medidas técnicas razonables para proteger tu información; sin embargo, ningún método de transmisión o almacenamiento es completamente seguro."] },
      { heading: "6. Compartir y Divulgar Datos", body: ["Respetamos tu privacidad y limitamos la divulgación de tus datos. En concreto:"], list: ["No vendemos, alquilamos ni intercambiamos tu información personal con nadie.", "No usamos tus datos para publicidad dirigida.", "Solo compartimos datos con el proveedor de infraestructura (Google Firebase) que los procesa y almacena en nuestro nombre.", "Podemos divulgar información si la ley lo exige o para proteger los derechos, la seguridad o la integridad de los usuarios y del Servicio."] },
      { heading: "7. Privacidad de los Menores", body: ["Learntopia está dirigido a niños y adolescentes, por lo que nos tomamos muy en serio la privacidad de los menores. Recopilamos únicamente la información mínima necesaria para ofrecer la experiencia de aprendizaje y nunca solicitamos datos personales innecesarios. Animamos a padres y tutores a supervisar el uso del Servicio por parte de sus hijos.", "Un padre o tutor puede contactarnos en cualquier momento para revisar, corregir o solicitar la eliminación de la información de un menor, y actuaremos sobre dichas solicitudes con prontitud."] },
      { heading: "8. Cookies y Tecnologías Similares", body: ["Usamos únicamente el almacenamiento estrictamente necesario para mantenerte conectado entre visitas, como los datos de sesión de autenticación gestionados por Firebase. No usamos cookies de publicidad ni de rastreo entre sitios."] },
      { heading: "9. Retención de Datos", body: ["Conservamos tu información mientras tu cuenta permanezca activa o según sea necesario para ofrecer el Servicio. Cuando solicites la eliminación de tu cuenta, eliminaremos tus datos personales asociados, salvo cuando estemos obligados a conservarlos para cumplir con una obligación legal."] },
      { heading: "10. Tus Derechos y Opciones", body: ["Según tu ubicación, puedes tener derechos sobre tus datos personales, incluido el derecho a:"], list: ["Acceder a la información personal que tenemos sobre ti.", "Solicitar la corrección de información inexacta o incompleta.", "Solicitar la eliminación de tu cuenta y los datos asociados.", "Retirar el consentimiento para el procesamiento opcional cuando corresponda."] },
      { heading: "11. Transferencias Internacionales de Datos", body: ["Debido a que usamos Google Firebase, tus datos pueden procesarse y almacenarse en servidores ubicados en otros países. Cuando los datos se transfieren internacionalmente, siguen sujetos a las salvaguardas adecuadas proporcionadas por el proveedor de infraestructura."] },
      { heading: "12. Servicios y Enlaces de Terceros", body: ["El Servicio depende de Google Firebase para la autenticación y el almacenamiento, y tu uso del inicio de sesión con Google también se rige por la propia política de privacidad de Google. El Servicio puede ocasionalmente hacer referencia a recursos de terceros; no somos responsables de las prácticas de privacidad de dichos terceros."] },
      { heading: "13. Cambios en esta Política", body: ["Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando hagamos cambios importantes, actualizaremos la fecha de \"Última actualización\" en la parte superior de esta página y, cuando corresponda, proporcionaremos un aviso adicional. Te animamos a revisar esta página periódicamente."] },
    ],
  },
  terms: {
    footerTitle: "¿Preguntas sobre estos Términos?",
    footerPre: "Contáctanos en",
    footerEmail: "Escribir a Soporte",
    footerMid: "o revisa nuestra",
    footerPrivacy: "Política de Privacidad",
    sections: [
      { heading: "1. Introducción y Aceptación", body: ["Estos Términos de Servicio (\"Términos\") rigen tu acceso y uso del sitio web, los cursos, los cuestionarios y los servicios relacionados de Learntopia (en conjunto, el \"Servicio\"). Al crear una cuenta o usar el Servicio, confirmas que has leído, entendido y aceptas quedar vinculado por estos Términos y por nuestra Política de Privacidad, que se incorpora aquí como referencia.", "Si no estás de acuerdo con alguna parte de estos Términos, no debes acceder ni usar el Servicio."] },
      { heading: "2. Definiciones", body: ["Para mayor claridad, los siguientes términos se usan a lo largo de este documento:"], list: ["\"Nosotros\", \"nos\" y \"nuestro\" se refieren al operador de Learntopia.", "\"Tú\" y \"Usuario\" se refieren a cualquier persona que acceda o use el Servicio.", "\"Contenido\" se refiere a todos los cursos, módulos, ejercicios, cuestionarios, textos, gráficos y demás material disponible a través del Servicio.", "\"Cuenta\" se refiere al perfil personal que creas para acceder a las funciones del Servicio."] },
      { heading: "3. Elegibilidad y Consentimiento Parental", body: ["El Servicio está diseñado como una herramienta educativa para niños y adolescentes. Si eres menor de edad, solo puedes usar el Servicio con el conocimiento, la participación y el consentimiento de un padre o tutor legal, quien acepta ser responsable de tu uso del Servicio y del cumplimiento de estos Términos.", "Al usar el Servicio, declaras que tienes la capacidad legal para aceptar estos Términos, o que un padre o tutor ha otorgado el consentimiento necesario en tu nombre."] },
      { heading: "4. Registro de Cuenta y Seguridad", body: ["Para acceder a ciertas funciones, debes crear una Cuenta usando una dirección de correo válida o un proveedor de inicio de sesión externo compatible (como Google). Aceptas proporcionar información precisa y completa y mantenerla actualizada.", "Eres responsable de proteger tus credenciales de acceso y de toda actividad que ocurra en tu Cuenta. Debes notificarnos de inmediato cualquier uso o acceso no autorizado a tu Cuenta. No somos responsables de ninguna pérdida derivada de no mantener seguras tus credenciales."] },
      { heading: "5. Uso Aceptable", body: ["Aceptas usar el Servicio únicamente con fines lícitos y educativos. En particular, aceptas:"], list: ["Usar los cursos, módulos y cuestionarios para un aprendizaje y una autoevaluación genuinos.", "Tratar a los demás usuarios y a la comunidad con respeto en cualquier interacción.", "Cumplir con todas las leyes aplicables y con estos Términos mientras usas el Servicio.", "Proporcionar información veraz al crear y mantener tu Cuenta."] },
      { heading: "6. Actividades Prohibidas", body: ["No debes, ni debes intentar:"], list: ["Copiar, reproducir, revender o redistribuir cualquier Contenido sin nuestro permiso previo por escrito.", "Interferir, interrumpir u obtener acceso no autorizado al Servicio, sus servidores o sus sistemas subyacentes.", "Eludir, deshabilitar o manipular cualquier función de seguridad o de seguimiento del progreso del Servicio.", "Usar el Servicio para transmitir material dañino, ilícito o malicioso, o para acosar a cualquier persona.", "Usar medios automatizados para acceder al Servicio de una manera que suponga una carga excesiva para nuestra infraestructura."] },
      { heading: "7. Propiedad Intelectual", body: ["El Servicio y todo el Contenido — incluidos el nombre, el logotipo, el diseño, los materiales de los cursos y el software de Learntopia — son propiedad nuestra o de nuestros licenciantes y están protegidos por las leyes de propiedad intelectual. Sujeto al cumplimiento de estos Términos, te otorgamos una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar el Servicio y el Contenido para tu aprendizaje personal y no comercial.", "No se otorgan otros derechos. Todos los derechos no concedidos expresamente quedan reservados por nosotros."] },
      { heading: "8. Aviso Legal Educativo", body: ["El Contenido se proporciona únicamente con fines educativos e informativos generales. Aunque nos esforzamos por mantenerlo preciso y actualizado, no ofrecemos garantía sobre la exhaustividad o exactitud de ningún Contenido, ni garantizamos ningún resultado, puntuación, titulación o efecto concreto del uso del Servicio."] },
      { heading: "9. Disponibilidad y Modificaciones del Servicio", body: ["El Servicio se ofrece actualmente de forma gratuita. Podemos añadir, modificar, suspender o interrumpir cualquier parte del Servicio en cualquier momento, y es posible que necesitemos dejar el Servicio temporalmente no disponible por mantenimiento o actualizaciones. Haremos esfuerzos razonables para minimizar las interrupciones, pero no somos responsables de la falta de disponibilidad del Servicio."] },
      { heading: "10. Servicios de Terceros", body: ["El Servicio depende de proveedores externos, incluido Google Firebase para la autenticación y el almacenamiento de datos. Tu uso de dichas funciones también puede estar sujeto a los términos y políticas del tercero correspondiente. No somos responsables de las prácticas de los servicios de terceros."] },
      { heading: "11. Suspensión y Terminación", body: ["Podemos suspender o cancelar tu acceso al Servicio, con o sin aviso, si incumples estos Términos o haces un mal uso del Servicio. Puedes dejar de usar el Servicio y solicitar la eliminación de tu Cuenta en cualquier momento. Las disposiciones que por su naturaleza deban sobrevivir a la terminación — incluidas las de propiedad intelectual, aviso legal y responsabilidad — seguirán aplicándose."] },
      { heading: "12. Renuncia de Garantías", body: ["El Servicio se proporciona \"tal cual\" y \"según disponibilidad\", sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas las garantías implícitas de comerciabilidad, idoneidad para un fin particular y no infracción, en la máxima medida permitida por la ley."] },
      { heading: "13. Limitación de Responsabilidad", body: ["En la máxima medida permitida por la ley aplicable, no seremos responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de datos o reputación, que surja de o esté relacionado con tu uso o incapacidad de usar el Servicio."] },
      { heading: "14. Indemnización", body: ["Aceptas indemnizarnos y eximirnos de responsabilidad ante cualquier reclamación, daño o gasto que surja de tu uso indebido del Servicio o de tu incumplimiento de estos Términos, en la medida permitida por la ley aplicable."] },
      { heading: "15. Ley Aplicable", body: ["Estos Términos se rigen por las leyes aplicables en la jurisdicción del operador, sin tener en cuenta los principios de conflicto de leyes. Cualquier disputa que surja de estos Términos será resuelta por los tribunales competentes de dicha jurisdicción."] },
      { heading: "16. Cambios en estos Términos", body: ["Podemos actualizar estos Términos de vez en cuando. Cuando hagamos cambios importantes, actualizaremos la fecha de \"Última actualización\" en la parte superior de esta página y, cuando corresponda, proporcionaremos un aviso adicional. Tu uso continuado del Servicio después de que los cambios entren en vigor constituye la aceptación de los Términos revisados."] },
    ],
  },
  doc: {
    featuresHeading: "Funciones",
    gettingStartedHeading: "Primeros Pasos",
    coursesHeading: "Cursos y Módulos Gamificados",
    coursesIntro: "Cada curso está diseñado para estudiantes de 7 a 16 años con una experiencia de lecciones gamificada y paso a paso. Los módulos deben completarse en orden para desbloquear el siguiente desafío.",
    tableColFeature: "Función / Componente",
    tableColDesc: "Descripción y Comportamiento",
    quizzesHeading: "Cuestionarios",
    quizzesIntro: "Los cuestionarios son evaluaciones sobre temas específicos, disponibles para todos los usuarios, incluidos los invitados. Cada cuestionario presenta un conjunto de preguntas de opción múltiple aleatorias con una cuenta regresiva de 15 segundos por pregunta.",
    dashboardHeading: "Panel",
    dashboardIntro: "El panel personal está disponible solo para usuarios autenticados. Reúne toda tu actividad de aprendizaje en una sola vista.",
    accountHeading: "Cuenta y Seguridad",
    accountIntro: "Puedes crear una cuenta con un correo y una contraseña, o iniciar sesión con Google. Tus datos se mantienen privados en tu cuenta y protegidos por sólidos controles de acceso aplicados en el servidor.",
    faqHeading: "Preguntas Frecuentes",
    footerTitle: "¿Falta algo o no queda claro?",
    footerPre: "Escríbenos a través de la",
    footerContact: "página de Contacto",
    footerMid: "o revisa nuestros",
    footerTerms: "Términos",
    footerAnd: "y la",
    footerPrivacy: "Política de Privacidad",
    features: [
      { title: "Soporte Multilingüe", text: "Cambia la interfaz de la plataforma entre los idiomas disponibles. Tu preferencia de idioma se guarda localmente y se aplica en cada visita." },
      { title: "Cursos Interactivos", text: "Inscríbete en itinerarios de cursos pensados para niños. Cada módulo contiene una lectura breve y una pregunta de comprensión. Debes responder correctamente para desbloquear el siguiente módulo — el progreso no se puede falsear." },
      { title: "Cuestionarios Cronometrados Dinámicos", text: "Pon a prueba tus conocimientos con una cuenta regresiva de 15 segundos por pregunta. Las preguntas se extraen de un gran conjunto y se aleatorizan en cada intento. Se muestra retroalimentación instantánea tras cada respuesta." },
      { title: "Sistema de Efectos de Sonido (Web Audio)", text: "Disfruta de efectos de sonido interactivos para respuestas correctas/incorrectas, finalización de módulos, fanfarrias de subida de nivel y desbloqueo de insignias, sintetizados 100% gratis y sin conexión en tu navegador. Activa o silencia el audio fácilmente desde la barra de navegación." },
      { title: "Panel Personal", text: "Consulta tus cursos inscritos y completados, barras de progreso por curso, tus mejores puntuaciones de cuestionarios, el total de puntos ganados y tu racha diaria actual, todo reunido en un solo lugar." },
      { title: "Rachas de Inicio de Sesión Diarias", text: "Tu racha aumenta cada día natural que inicias sesión. Si te saltas un día, la racha se reinicia. Las rachas se calculan según tu zona horaria local y se muestran en la cabecera del panel y en la cuadrícula de métricas." },
      { title: "Clasificaciones Globales y por Cuestionario", text: "La clasificación ordena a los usuarios por puntos totales y por puntuaciones de cuestionarios individuales. La pestaña y la página de clasificación son visibles exclusivamente para usuarios que han iniciado sesión, para proteger las clasificaciones de la comunidad." },
      { title: "Indicadores de Finalización de Cuestionarios", text: "Las tarjetas de cuestionarios completados muestran una insignia verde de Hecho y tu mejor puntuación. El botón Empezar se convierte en Repetir. Abandonar un cuestionario a mitad no cuenta como intento — las puntuaciones solo se registran en la pantalla de resultados." },
      { title: "Conservación de Puntuación de Invitados", text: "Haz un cuestionario como invitado y termínalo, luego usa el enlace de Iniciar Sesión o Registrarse en la pantalla de resultados. Tu puntuación se guarda automáticamente en tu perfil al autenticarte, sin pérdida de datos." },
      { title: "Tutor con IA", text: "Leo es el tutor con IA de todos los cursos. Cada pregunta lleva el curso y el módulo en el que estás, así que las respuestas se mantienen en la materia que estudias." },
      { title: "Modo de Concentración Estricto", text: "Un bloqueador de rutas personalizado detecta los intentos de navegación durante cuestionarios o desafíos de módulo activos y muestra un diálogo de confirmación para evitar la pérdida accidental de progreso." },
      { title: "Controles del Curso", text: "Cancela tu inscripción a cursos directamente desde tu panel. Reinicia un curso completado al 100% para empezar de nuevo. Retoma los cursos en curso justo donde los dejaste." },
      { title: "Catálogo con Búsqueda", text: "Filtra los cursos por título o materia usando el campo de búsqueda en vivo. Se muestra un estado vacío informativo cuando ningún resultado coincide con la búsqueda." },
      { title: "Privado y Seguro", text: "Tus datos — perfil, cursos, progreso e intentos de cuestionarios — son privados de tu cuenta. Solo tú puedes verlos o cambiarlos, y la clasificación muestra únicamente tu nombre y puntuación, nunca tu correo ni tus datos de contacto." },
    ],
    steps: [
      { step: "01", title: "Crea una cuenta", text: "Haz clic en Registrarse en la barra de navegación. Regístrate con tu correo y una contraseña, o continúa con Google para una configuración con un solo clic. Las cuentas de correo/contraseña requieren un nombre visible." },
      { step: "02", title: "Explora el catálogo de cursos", text: "Ve a Cursos para ver todos los itinerarios de aprendizaje disponibles. Usa la barra de búsqueda para filtrar por materia o título. Haz clic en cualquier tarjeta de curso para ver el temario completo y la lista de módulos." },
      { step: "03", title: "Inscríbete y empieza a aprender", text: "Haz clic en Inscribirse en la página de detalle del curso. Los módulos se desbloquean en orden — lee cada lección y luego responde correctamente la pregunta de comprensión para desbloquear el siguiente módulo." },
      { step: "04", title: "Haz cuestionarios", text: "Visita el Centro de Cuestionarios para poner a prueba tus conocimientos. Elige un tema, responde todas las preguntas dentro del tiempo límite y consulta tu puntuación en la pantalla de resultados. Los cuestionarios completados muestran una insignia de Hecho en la tarjeta de selección." },
      { step: "05", title: "Sigue tu progreso", text: "Abre tu Panel para ver los cursos inscritos, los porcentajes de finalización, tus mejores puntuaciones de cuestionarios, el total de puntos y tu racha actual. Consulta la Clasificación para comparar tu puntuación con la de otros." },
    ],
    coursesTable: [
      { concept: "Reproductor de Lecciones Paso a Paso", behaviour: "Presenta el contenido del módulo de una tarjeta a la vez con temas visuales distintos (Historia, Concepto, Dato Curioso, Consejo Pro, Ejemplo, Actividad, Resumen) y resaltado de sintaxis de código." },
      { concept: "Motor de Ejercicios Multitipo", behaviour: "Evalúa la comprensión mediante 4 formatos interactivos: Opción Múltiple (MCQ), Verdadero/Falso, Rellenar el Espacio y Emparejar Pares." },
      { concept: "Gamificación y Sistema de Niveles", behaviour: "Gana XP completando módulos de cursos (+50 XP cada uno, +100 XP por curso completo) y cuestionarios (20–100 XP según tu puntuación). Sube de nivel desde Programador Novato (Nivel 1) hasta Gran Maestro (Nivel 5)." },
      { concept: "Insignias y Celebraciones", behaviour: "Desbloquea insignias únicas de cada curso (p. ej. Pionero de Python, Mago de las Matemáticas) con superposiciones a pantalla completa al conseguirlas." },
      { concept: "Progreso del curso", behaviour: "Registra los módulos completados en tiempo real con barras de progreso, guardadas automáticamente. Retoma cuando quieras desde tu Panel de Estudiante." },
      { concept: "Reinicio del curso", behaviour: "Reinicia los cursos completados cuando quieras con el botón Empezar de Nuevo para repetir las lecciones y volver a practicar." },
    ],
    quizMeta: [
      { label: "Temporizador", value: "15 segundos por pregunta. El temporizador se reinicia en cada nueva pregunta." },
      { label: "Conjunto de preguntas", value: "Las preguntas se aleatorizan de un gran conjunto en cada intento, así que repetir un cuestionario ofrece una experiencia nueva." },
      { label: "Retroalimentación", value: "Después de enviar una respuesta, la respuesta correcta se revela de inmediato antes de pasar a la siguiente pregunta." },
      { label: "Registro de puntuación", value: "Las puntuaciones solo se guardan cuando completas todas las preguntas y llegas a la pantalla de resultados. Salir antes no registra nada." },
      { label: "Puntos", value: "Cada respuesta correcta otorga 10 puntos que se suman a tu total acumulado." },
      { label: "Sincronización con la clasificación", value: "Tu puntuación se sincroniza con la clasificación de cada cuestionario y tus puntos totales se actualizan en la clasificación global." },
      { label: "Intentos de invitados", value: "Los invitados pueden hacer cualquier cuestionario. En la pantalla de resultados, los enlaces permiten iniciar sesión o registrarse con transferencia automática de la puntuación." },
      { label: "Repetir", value: "Los cuestionarios completados muestran un botón de Repetir. Se registran las mejores puntuaciones — solo se muestra tu mejor puntuación por cuestionario." },
    ],
    dashboardList: [
      "Cabecera de perfil — muestra tu nombre visible, la inicial del avatar, los puntos totales y tu racha diaria actual.",
      "Cuadrícula de métricas — muestra puntos totales, intentos de cuestionarios, cursos inscritos y racha en tarjetas numéricas.",
      "Cursos activos — lista los cursos en curso con una barra de progreso en vivo y un botón de Continuar.",
      "Cursos completados — lista todos los cursos completados por completo.",
      "Mejores puntuaciones de cuestionarios — muestra tu mejor puntuación por cuestionario entre todos los intentos.",
      "Eliminar perfil — opción para eliminar permanentemente tu cuenta y todos los datos de aprendizaje en cualquier momento.",
    ],
    accountCards: [
      { title: "Privacidad Estricta de la Cuenta y Aislamiento de Datos", text: "Learntopia usa cifrado de nivel empresarial y un estricto aislamiento de cuentas para mantener seguro tu perfil de estudiante. Tu historial de aprendizaje personal, tus notas de cursos y la configuración de tu cuenta solo pueden ser consultados por ti cuando has iniciado sesión." },
      { title: "Guía de Autenticación Inteligente", text: "Al intentar iniciar sesión con un correo no registrado, se muestra automáticamente una opción interactiva para crear una cuenta nueva, rellenando previamente el correo que introdujiste en el formulario de registro. Del mismo modo, registrarse con un correo existente ofrece una opción de 1 clic para iniciar sesión sin volver a escribir las credenciales." },
      { title: "Funciona Sin Conexión", text: "Si tu conexión a internet se corta mientras haces un cuestionario o lees un módulo, tu progreso se mantiene a salvo en tu dispositivo y se sincroniza automáticamente en cuanto te reconectas, para que nunca pierdas tu lugar." },
      { title: "Resistente por Diseño", text: "Si alguna vez una página no carga por una conexión inestable, Learntopia muestra una opción amigable para recargar en lugar de una pantalla en blanco o un error — una señal perdida nunca interrumpe tu sesión." },
      { title: "Tus Datos Siguen Siendo Tuyos", text: "Tu perfil, cursos, progreso e historial de cuestionarios están vinculados a tu cuenta y nadie más puede verlos ni modificarlos. Entre bastidores, las salvaguardas mantienen las puntuaciones e insignias justas y a prueba de manipulaciones, para que la clasificación siga siendo honesta." },
    ],
    faq: [
      { q: "¿Necesito una cuenta para usar Learntopia?", a: "No. Los cursos y cuestionarios se pueden explorar sin una cuenta. Sin embargo, el progreso, las puntuaciones y las rachas solo se guardan para usuarios autenticados. Las puntuaciones de cuestionarios de invitados pueden guardarse de forma retroactiva iniciando sesión desde la pantalla de resultados." },
      { q: "¿Cómo funciona el contador de rachas?", a: "Tu racha aumenta en uno cada día natural que inicias sesión (calculado según tu zona horaria local). Iniciar sesión varias veces el mismo día cuenta como un día. Saltarte un día reinicia la racha a 1." },
      { q: "¿Por qué no apareció mi puntuación en la clasificación?", a: "Las puntuaciones solo se registran cuando completas todas las preguntas y llegas a la pantalla de resultados. Salir a mitad del cuestionario no guarda ningún dato. Si has iniciado sesión y completas un cuestionario, la puntuación debería aparecer en la clasificación en segundos." },
      { q: "¿Qué pasa si salgo de un cuestionario a la mitad?", a: "No se guarda nada. No hay crédito parcial. La tarjeta del cuestionario no mostrará una insignia de Hecho. Puedes reiniciar el cuestionario desde cero en cualquier momento." },
      { q: "¿Cómo funciona la finalización de un curso?", a: "Debes completar cada módulo en orden. Cada módulo requiere una respuesta correcta a la pregunta de comprensión antes de que se desbloquee el siguiente. El curso se marca como completado solo cuando todos los módulos están hechos." },
      { q: "¿Puedo reiniciar un curso completado?", a: "Sí. Abre la página de detalle de un curso completado al 100%. Aparecerá un botón de Empezar de Nuevo que te permite reiniciar todo el progreso de los módulos y comenzar desde el primero." },
      { q: "¿La plataforma es gratuita?", a: "Sí, completamente gratuita. Sin suscripción, sin cursos de pago, sin publicidad." },
      { q: "¿Quién puede ver mi puntuación en la clasificación?", a: "Cualquier usuario autenticado de Learntopia puede ver la Clasificación Global. Muestra únicamente tu nombre visible y tus puntos totales. Tu correo, el progreso de los cursos y el historial de cuestionarios nunca son visibles para otros usuarios." },
    ],
  },
  quizzesData: {
    python: {
      title: "Python para Niños",
      subject: "Programación",
      description: "¡Pon a prueba tus conocimientos de Python básico, variables y bucles!",
      questions: [
        { questionText: "¿Qué es Python?", options: ["Un tipo de serpiente", "Un lenguaje de computadora", "Un videojuego", "Una calculadora"] },
        { questionText: "¿Qué comando hace que la computadora muestre texto?", options: ["show()", "speak()", "print()", "display()"] },
        { questionText: "Python es famoso por ser:", options: ["Muy difícil de leer", "Solo para científicos", "Fácil de leer para humanos", "Solo para computadoras viejas"] },
        { questionText: "¿Qué es una variable?", options: ["Una caja etiquetada para guardar datos", "Un tipo de error", "Un problema de matemáticas", "Una impresora"] },
        { questionText: "¿Cómo llamamos al texto como 'Hola' en programación?", options: ["Entero", "Cadena (String)", "Número", "Texto de robot"] },
        { questionText: "Si score = 4 + 6, ¿qué hay dentro de la variable score?", options: ["46", "4 + 6", "10", "Error"] },
        { questionText: "¿Qué permiten hacer las 'sentencias if' a un programa?", options: ["Fallar", "Tomar decisiones", "Mostrar texto", "Guardar variables"] },
        { questionText: "En código, ¿qué significa el símbolo '>'?", options: ["Igual a", "Menor que", "Mayor que", "Más"] },
        { questionText: "¿Cuál de estas es una sentencia if correcta?", options: ["if score is 10 then win", "if score > 10:", "score if 10", "if (10) score"] },
        { questionText: "¿Qué comando permite al usuario escribir una respuesta?", options: ["print()", "type()", "input()", "read()"] },
        { questionText: "¿Por qué usamos un bucle en un juego?", options: ["Para hacerlo colorido", "Para dejar que el jugador adivine varias veces", "Para detener el juego", "Para hacerlo más difícil"] },
        { questionText: "Si el secreto es 5 y adivinas 8, el programa debería decir:", options: ["¡Muy bajo!", "¡Muy alto!", "¡Ganaste!", "Error"] },
        { questionText: "¿En qué programa de TV se inspiró el nombre de Python?", options: ["Python Rangers", "Monty Python's Flying Circus", "The Daily Python", "Snake TV"] },
        { questionText: "¿Qué tipo de dato es un número entero como 5?", options: ["Cadena (String)", "Entero (Integer)", "Decimal (Float)", "Booleano"] },
        { questionText: "Si Mario golpea a un Goomba, ¿qué tipo de sentencia maneja que pierda una vida?", options: ["Una sentencia print", "Una sentencia if", "Un bucle", "Una cadena"] }
      ]
    },
    math: {
      title: "Magia Matemática",
      subject: "Matemáticas",
      description: "Pon a prueba tus habilidades en secuencias, geometría y acertijos lógicos.",
      questions: [
        { questionText: "¿Cuál es el siguiente número en: 5, 10, 15, 20...?", options: ["22", "25", "30", "100"] },
        { questionText: "¿Cuál es el siguiente número en: 1, 3, 5, 7...?", options: ["8", "9", "10", "11"] },
        { questionText: "¿Cómo llamamos a una lista de números que sigue una regla?", options: ["Un desorden", "Una secuencia", "Una variable", "Un bucle"] },
        { questionText: "¿Cuántos lados tiene un hexágono?", options: ["4", "5", "6", "8"] },
        { questionText: "¿Cómo llamamos a un cuadrado en 3D?", options: ["Esfera", "Cubo", "Pirámide", "Cilindro"] },
        { questionText: "¿Qué tipo de ángulo mide exactamente 90 grados?", options: ["Ángulo lindo", "Ángulo recto", "Ángulo incorrecto", "Ángulo izquierdo"] },
        { questionText: "Si A es más alto que B, y B es más alto que C. ¿Quién es el más alto?", options: ["A", "B", "C", "Son iguales"] },
        { questionText: "Tengo 4 patas pero no puedo caminar. ¿Qué soy?", options: ["Un perro", "Una silla", "Un pájaro", "Una serpiente"] },
        { questionText: "¿Qué es el razonamiento deductivo?", options: ["Adivinar al azar", "Usar pistas para eliminar respuestas incorrectas", "Sumar números", "Dibujar formas"] },
        { questionText: "¿Qué es un algoritmo?", options: ["Un error matemático", "Un tipo de dinosaurio", "Una lista de instrucciones paso a paso", "Una figura 3D"] },
        { questionText: "¿Por qué importa el orden de los pasos en un algoritmo?", options: ["No importa", "Para que la computadora no se confunda y falle", "Porque se ve bonito", "Para ahorrar electricidad"] },
        { questionText: "¿Cuál es la mejor forma de resolver un problema enorme y difícil?", options: ["Dividirlo en pasos pequeños y sencillos", "Empezar por la parte más difícil e ir hacia atrás", "Hacerlo entero de cabeza y de una vez", "Saltar al resultado y comprobarlo después"] },
        { questionText: "La secuencia de Fibonacci se encuentra en:", options: ["Solo en libros de texto", "Semillas de girasol y galaxias", "Solo en computadoras", "En ningún lugar"] },
        { questionText: "Si tienes un triángulo, ¿cuántos ángulos tiene?", options: ["2", "3", "4", "5"] },
        { questionText: "¿Qué empresa usa algoritmos para encontrar sitios web para ti?", options: ["Nintendo", "Google", "McDonald's", "Ford"] }
      ]
    },
    finance: {
      title: "Dinero Inteligente",
      subject: "Finanzas",
      description: "Presupuestos, inversiones y la historia del dinero.",
      questions: [
        { questionText: "¿Qué es el trueque?", options: ["Usar tarjetas de crédito", "Intercambiar bienes directamente", "Invertir en acciones", "Ahorrar en un banco"] },
        { questionText: "¿Por qué se inventó el dinero?", options: ["Porque las monedas brillan", "Para facilitar el comercio", "Para hacer las carteras pesadas", "Porque las gallinas se escaparon"] },
        { questionText: "El dinero solo funciona si...", options: ["Está hecho de oro", "Está impreso en papel verde", "Todos acuerdan que tiene valor", "Tiene la cara de un presidente"] },
        { questionText: "El dinero que ENTRA a tu bolsillo se llama:", options: ["Gasto", "Ingreso", "Impuesto", "Deuda"] },
        { questionText: "El dinero que SALE (cuando compras algo) se llama:", options: ["Gasto", "Ingreso", "Ganancia", "Dividendo"] },
        { questionText: "Un buen presupuesto asegura que...", options: ["Gastes todo", "Tus gastos sean mayores que tus ingresos", "Tus gastos sean menores que tus ingresos", "Compres juguetes cada día"] },
        { questionText: "Cuando un banco te paga por guardar dinero con ellos, se llama:", options: ["Impuestos", "Interés", "Multas", "Préstamos"] },
        { questionText: "¿Qué es el interés compuesto?", options: ["Ganar interés sobre el interés", "Perder dinero", "Pagar al banco", "Interés simple"] },
        { questionText: "El interés compuesto funciona mejor cuando...", options: ["Sacas tu dinero de inmediato", "Dejas tu dinero en el banco por mucho tiempo", "Lo gastas todo", "Lo escondes bajo la cama"] },
        { questionText: "Cuando compras una acción, ¿qué estás comprando?", options: ["Un trozo de papel", "Una pequeña parte de una empresa", "Un préstamo al gobierno", "Un producto"] },
        { questionText: "El objetivo de invertir es...", options: ["Hacer crecer tu dinero", "Perder dinero", "Mantenerlo exactamente igual", "Pagar impuestos"] },
        { questionText: "¿Es arriesgado invertir?", options: ["No, está garantizado", "Sí, las empresas pueden perder valor", "Solo para personas mayores", "No, siempre ganas"] },
        { questionText: "La regla de oro para crear riqueza es:", options: ["Siempre gastar menos de lo que ganas", "Gastar todo lo que tienes", "Pedir prestado lo máximo posible", "Nunca usar un banco"] },
        { questionText: "¿Qué es un presupuesto?", options: ["Un tipo de animal", "Un plan para tu dinero", "Un tipo de cuenta bancaria", "Un préstamo"] },
        { questionText: "Si compras acciones de Disney, eres dueño de:", options: ["Toda la empresa", "Una pequeña parte de Disney", "Todas sus películas", "Nada"] }
      ]
    },
    marketing: {
      title: "Creadores del Futuro",
      subject: "Marketing",
      description: "Marca, narrativa y seguridad digital para creadores.",
      questions: [
        { questionText: "¿Qué es una marca?", options: ["Solo un logo", "El sentimiento y la reputación de una empresa", "El edificio donde trabajan", "El nombre del director"] },
        { questionText: "¿Por qué las empresas usan colores específicos?", options: ["Porque son baratos", "Para provocar emociones específicas", "Porque es al azar", "Para esconder la suciedad"] },
        { questionText: "¿Cuál de estos es parte de la identidad de una marca?", options: ["Logos, colores y tipografías", "Salarios de empleados", "Las sillas de oficina", "Declaraciones de impuestos"] },
        { questionText: "En marketing, ¿quién debe ser el Héroe de la historia?", options: ["El director", "El producto", "El cliente", "El competidor"] },
        { questionText: "¿Por qué usamos la narrativa en marketing?", options: ["Para dormir a la gente", "Para crear una conexión emocional", "Para llenar espacio", "Para confundir a la gente"] },
        { questionText: "Una buena historia debe enganchar al espectador en los primeros...", options: ["3 segundos", "3 minutos", "1 hora", "3 días"] },
        { questionText: "¿Qué es tu huella digital?", options: ["Tu talla de zapato", "El rastro de datos que dejas en línea", "La tinta de tu impresora", "La pantalla de tu computadora"] },
        { questionText: "¿Cuál de los siguientes es información personal (PII) que NUNCA debes compartir?", options: ["Tu película favorita", "Tu dirección de casa", "Un dibujo", "Una reseña de un juego"] },
        { questionText: "¿Se pueden borrar fácilmente las cosas para siempre de internet?", options: ["Sí, al instante", "No, la gente puede tomar capturas y guardarlas", "Sí, pidiéndolo amablemente", "Sí, si apagas la computadora"] },
        { questionText: "¿Qué significa CTA?", options: ["Llamada a la acción (Call To Action)", "Alineación central del texto", "Costo de publicidad", "Clic para añadir"] },
        { questionText: "¿Cuál es un ejemplo de un CTA?", options: ["'Vendemos zapatos.'", "'¡Suscríbete para más videos!'", "'Las manzanas son rojas.'", "'Hola.'"] },
        { questionText: "Antes de lanzar una campaña, necesitas conocer tu...", options: ["Color favorito", "Público objetivo", "Talla de zapato", "Pedido de almuerzo"] },
        { questionText: "¿Qué colores usa McDonald's para hacerte sentir feliz y con hambre?", options: ["Azul y verde", "Rojo y amarillo", "Negro y blanco", "Morado y naranja"] },
        { questionText: "En una historia de marketing, el producto debe actuar como el:", options: ["Héroe", "Villano", "Guía", "Fondo"] },
        { questionText: "¿Cuál es la mejor forma de practicar la ciudadanía digital?", options: ["Ser grosero en los comentarios", "Respetar a los demás y dar crédito", "Robar arte", "Compartir contraseñas"] }
      ]
    },
    web: {
      title: "Maravillas Web",
      subject: "Ciencia",
      description: "Pon a prueba tus habilidades de HTML, CSS y diseño.",
      questions: [
        { questionText: "¿Qué proporciona HTML a una página web?", options: ["Colores", "Animaciones", "La estructura básica (esqueleto)", "La base de datos"] },
        { questionText: "¿Qué etiqueta se usa para el encabezado más grande?", options: ["<p>", "<h1>", "<h6>", "<div>"] },
        { questionText: "¿Qué etiqueta se usa para un párrafo de texto?", options: ["<text>", "<p>", "<para>", "<h>"] },
        { questionText: "¿Qué hace CSS?", options: ["Construye la estructura", "Da estilo a la página con colores y diseños", "Guarda contraseñas", "Ejecuta el servidor"] },
        { questionText: "¿Cómo harías el texto rojo en CSS?", options: ["text: red;", "color: red;", "font-color: red;", "make-red;"] },
        { questionText: "¿Puede CSS cambiar la tipografía de tu texto?", options: ["Sí", "No", "Solo los martes", "Solo si es azul"] },
        { questionText: "En el modelo de caja de CSS, ¿cómo se llama el espacio DENTRO del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
        { questionText: "¿Cómo se llama el espacio FUERA del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
        { questionText: "¿Las imágenes circulares son en realidad cajas en CSS?", options: ["Sí, todo es una caja", "No, los círculos son círculos", "No, son triángulos", "Solo si son rojas"] },
        { questionText: "¿Qué es un servidor?", options: ["Un camarero", "Una computadora que se mantiene en línea para alojar tus archivos", "Un tipo de CSS", "Una computadora rota"] },
        { questionText: "¿Qué obtienes para que la gente visite tu sitio?", options: ["Una URL", "Una memoria USB", "Una contraseña", "Un libro"] },
        { questionText: "¿Qué significa 'Desplegar' (Deploying)?", options: ["Borrar tu código", "Poner tu código en un servidor en vivo para que el mundo lo vea", "Escribir HTML", "Jugar un juego"] },
        { questionText: "¿Qué es el DOM?", options: ["Modelo de Objetos del Documento", "Matemática Directa de Objetos", "Creador de Esquemas Digitales", "Perro en la Luna"] },
        { questionText: "¿Por qué es importante el HTML semántico?", options: ["Hace el sitio colorido", "Ayuda a usuarios ciegos y a los buscadores", "Hace el código más corto", "No es importante"] },
        { questionText: "¿Qué capa del modelo de caja contiene el texto real?", options: ["Margen (Margin)", "Borde (Border)", "Relleno (Padding)", "Contenido (Content)"] }
      ]
    },
    art: {
      title: "Arte Digital",
      subject: "Artes",
      description: "Capas, teoría del color y herramientas de dibujo.",
      questions: [
        { questionText: "¿A qué se parecen las capas en el arte digital?", options: ["Rocas pesadas", "Láminas de vidrio transparentes apiladas una sobre otra", "Una sola hoja de papel", "Un pincel"] },
        { questionText: "¿Por qué los artistas usan capas?", options: ["Para hacer el archivo pesado", "Para colorear sin arruinar el boceto (no destructivo)", "Para romper la computadora", "Para dibujar más lento"] },
        { questionText: "Si borras en la Capa 2, ¿se borra la Capa 1?", options: ["Sí", "No", "Solo si es roja", "Siempre"] },
        { questionText: "Los colores opuestos en la rueda cromática se llaman:", options: ["Análogos", "Complementarios", "Primarios", "Aburridos"] },
        { questionText: "¿Cuál es un ejemplo de colores complementarios?", options: ["Rojo y rosa", "Azul y naranja", "Verde y verde", "Negro y blanco"] },
        { questionText: "¿Qué crean los colores complementarios?", options: ["Aburrimiento", "Máximo contraste y emoción", "Un desastre gris", "Invisibilidad"] },
        { questionText: "¿Qué es la regla de los tercios?", options: ["Dividir el lienzo en una cuadrícula de 3x3", "Dibujar 3 círculos", "Usar solo 3 colores", "Tardar 3 horas en dibujar"] },
        { questionText: "¿Dónde debes colocar tu sujeto principal para una composición cinematográfica?", options: ["En el centro exacto", "Fuera del lienzo", "En las intersecciones de la cuadrícula", "Siempre en la esquina inferior"] },
        { questionText: "¿El centro exacto es siempre el mejor lugar para un personaje?", options: ["Sí", "No, la regla de los tercios suele ser mejor", "Siempre", "Solo los lunes"] },
        { questionText: "¿Qué es el renderizado?", options: ["Añadir luz y sombra para que parezca 3D", "Borrar el dibujo", "Añadir una firma", "Guardar el archivo"] },
        { questionText: "La parte del objeto que mira al sol recibe un:", options: ["Sombra", "Brillo (Highlight)", "Contorno", "Firma"] },
        { questionText: "La parte que da la espalda a la luz recibe una:", options: ["Brillo (Highlight)", "Sombra", "Color brillante", "Punto blanco"] },
        { questionText: "Al dibujar un personaje, ¿qué debes dibujar primero?", options: ["Ojos detallados", "Formas 3D básicas como esferas y cilindros", "El fondo", "El cabello"] },
        { questionText: "¿Qué significa 'valor' en la teoría del color?", options: ["Cuánto cuesta una pintura", "Qué tan claro u oscuro es un color", "Cuántos colores usas", "Qué tan grande es el pincel"] },
        { questionText: "¿Dónde ocurre la 'Oclusión Ambiental'?", options: ["A la luz directa del sol", "En hendiduras profundas donde la luz no llega", "En el cielo", "En el brillo"] }
      ]
    }
    ,
    computer: {
      title: "Computadora con Confianza",
      subject: "Informática",
      description: "Sistemas operativos, atajos, cómo llega la web hasta ti y correos que sí se leen.",
      questions: [
        { questionText: "¿De qué se encarga un sistema operativo?", options: ["Guardar tus fotos a salvo", "Hacer funcionar todos los demás programas", "Conectarte a internet", "Ajustar el brillo de la pantalla"] },
        { questionText: "¿Qué sistema operativo usan casi todos los servidores de las webs?", options: ["Windows", "macOS", "Linux", "Android"] },
        { questionText: "¿Por qué un Mac y un iPhone se sienten parecidos?", options: ["Se fabrican en una sola planta", "Sus sistemas comparten las mismas raíces", "Los dos necesitan internet constante", "Salieron el mismo año"] },
        { questionText: "¿Qué hace Ctrl+Z?", options: ["Guarda tu archivo", "Deshace lo último que hiciste", "Cierra la ventana", "Selecciona todo"] },
        { questionText: "¿Qué tecla sustituye a Ctrl en un Mac?", options: ["Alt", "Shift", "Cmd", "Fn"] },
        { questionText: "¿Qué atajo busca una palabra en la página que lees?", options: ["Ctrl+F", "Ctrl+S", "Ctrl+A", "Ctrl+V"] },
        { questionText: "Borras un párrafo sin querer. ¿Cuál es la solución más rápida?", options: ["Cerrar sin guardar", "Pulsar Ctrl+Z", "Reescribirlo de memoria", "Reiniciar la computadora"] },
        { questionText: "¿Qué ocurre cuando escribes una dirección web y pulsas enter?", options: ["Tu navegador la pide a un servidor", "La página se construye en tu computadora", "Tu proveedor elige un sitio por ti", "El navegador busca en tus archivos"] },
        { questionText: "¿Qué te dice el candado de la barra de direcciones?", options: ["Que el sitio es honesto", "Que la conexión va cifrada", "Que la página carga más rápido", "Que el sitio no tiene anuncios"] },
        { questionText: "En https://ejemplo.com/fotos, ¿qué parte elige la página?", options: ["https", "ejemplo.com", "/fotos", "El candado"] },
        { questionText: "Ninguna web carga. ¿Dónde está el problema, seguramente?", options: ["En esa web concreta", "En tu propia conexión", "En la barra de direcciones", "En tu teclado"] },
        { questionText: "¿Por qué importa un asunto claro?", options: ["Hace que el correo llegue antes", "La gente decide por él si lo abre", "El correo no se envía sin asunto", "Evita que acabe en spam"] },
        { questionText: "¿Qué hace poner a alguien en Cc?", options: ["Lo oculta de los demás", "Lo mantiene al tanto, a la vista", "Le envía el correo primero", "Le impide responder"] },
        { questionText: "Un correo pide tu contraseña o cerrarán tu cuenta. ¿Qué haces?", options: ["Responder rápido para no perder nada", "Enseñárselo a un adulto y no enviar nada", "Enviarla si el logo parece correcto", "Reenviarlo a todos tus amigos"] },
        { questionText: "¿Cuál de estos es un archivo enviado junto a un correo?", options: ["Un asunto", "Un adjunto", "Una firma", "Un destinatario"] }
      ]
    },
    nutrition: {
      title: "Científico de la Comida",
      subject: "Salud",
      description: "Calorías, los tres grandes macros, los micros diminutos y por qué nadie necesita lo mismo.",
      questions: [
        { questionText: "¿Qué mide una caloría?", options: ["Cuánto azúcar lleva un alimento", "Cuánta energía te da un alimento", "Cuánto pesa una ración", "Cuánto tarda en digerirse"] },
        { questionText: "¿Más o menos cuánta energía diaria usa tu cerebro?", options: ["Alrededor del dos por ciento", "Alrededor del veinte por ciento", "Más o menos la mitad", "Casi nada"] },
        { questionText: "¿En qué se va casi toda la energía que usas cada día?", options: ["Deporte y ejercicio", "Vivir y crecer", "Digerir la comida", "Cargar el teléfono"] },
        { questionText: "¿Qué significa macro en macronutriente?", options: ["Grande", "Raro", "Dulce", "Cocinado"] },
        { questionText: "¿Qué macronutriente construye y repara músculo sobre todo?", options: ["Carbohidrato", "Proteína", "Grasa", "Fibra"] },
        { questionText: "¿Qué macronutriente da la energía más rápida?", options: ["Carbohidrato", "Proteína", "Grasa", "Calcio"] },
        { questionText: "¿Qué hace la grasa en tu cuerpo?", options: ["Nada útil", "Energía lenta y protección", "Solo dar sabor a la comida", "Sustituir a la proteína"] },
        { questionText: "¿Cuántos de los tres macronutrientes necesita un cuerpo sano?", options: ["Solo uno", "Dos de ellos", "Los tres", "Ninguno"] },
        { questionText: "¿Qué te dan las vitaminas y los minerales?", options: ["Energía para correr", "Herramientas para tareas como formar hueso", "Peso corporal extra", "Agua para hidratarte"] },
        { questionText: "¿Qué mineral transporta oxígeno en tu sangre?", options: ["Calcio", "Hierro", "Sodio", "Zinc"] },
        { questionText: "¿Qué vitamina puede fabricar tu piel con el sol?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"] },
        { questionText: "¿Por qué enfermaban los marineros pese a tener comida de sobra?", options: ["Tomaban poca proteína", "Les faltaba vitamina C", "Bebían demasiada agua", "Solo comían de noche"] },
        { questionText: "¿Qué mineral forma sobre todo huesos y dientes?", options: ["Hierro", "Calcio", "Vitamina C", "Proteína"] },
        { questionText: "¿Qué cambia la energía que alguien necesita al día?", options: ["Solo su peso", "Su tamaño, edad y actividad", "Solo el deporte que hace", "La estación del año"] },
        { questionText: "¿Quién debería responder una duda sobre tu propia alimentación?", options: ["Un médico", "Un buscador", "Un vídeo de redes", "Quien publique más"] }
      ]
    },
    ai: {
      title: "La IA Explicada",
      subject: "Alfabetización en IA",
      description: "Cómo aprende la IA, por qué se equivoca con seguridad, por dónde entra la injusticia y cómo usarla bien.",
      questions: [
        { questionText: "¿Cómo aprende sobre todo la IA moderna a distinguir cosas?", options: ["Una persona escribe una regla por caso", "Encuentra patrones en muchos ejemplos", "Busca la respuesta en internet", "Pregunta a un humano cada vez"] },
        { questionText: "¿En qué se apoyaban los programas antiguos?", options: ["Reglas escritas por una persona", "Patrones hallados en fotos", "Preguntas hechas a los usuarios", "Adivinar al azar cada vez"] },
        { questionText: "¿Entiende un modelo de imágenes a un gato como tú?", options: ["Sí, exactamente igual", "No, solo reconoce patrones", "Sí, si ha visto suficientes", "Solo los animales que ha conocido"] },
        { questionText: "¿Por qué puede una IA inventarse un libro que no existe?", options: ["Su biblioteca está anticuada", "Predice palabras probables, no consulta", "Alguien borró el registro real", "Quiere engañarte a propósito"] },
        { questionText: "¿Cómo suena la IA cuando su respuesta es incorrecta?", options: ["Claramente insegura", "Igual de segura que siempre", "Se niega a responder", "Te avisa antes de responder"] },
        { questionText: "¿En qué es más débil la IA?", options: ["Explicar una idea otra vez", "Fechas y fuentes exactas", "Sugerir un punto de partida", "Reformular algo de forma simple"] },
        { questionText: "Una IA te da un dato para los deberes. ¿Y ahora?", options: ["Úsalo, sonaba seguro", "Compruébalo en otra fuente", "Pregúntale lo mismo otra vez", "Úsalo solo si es corto"] },
        { questionText: "¿Por qué dibuja una IA siempre al mismo tipo de persona en un oficio?", options: ["Ha decidido quién encaja", "Sus ejemplos mostraban sobre todo a esa persona", "Copia a otra IA", "Los demás son más difíciles de dibujar"] },
        { questionText: "¿De dónde suele venir el sesgo de un sistema de IA?", options: ["De los ejemplos con los que aprendió", "De las opiniones de la computadora", "Del país donde se usa", "De la hora a la que funciona"] },
        { questionText: "¿Cuál es una forma rápida de detectar esa injusticia?", options: ["Preguntar quién falta en la foto", "Hacer la pregunta una sola vez", "Mirar lo rápido que respondió", "Contar las palabras que usó"] },
        { questionText: "¿Qué hace que el sesgo de la IA sea mayor problema que la opinión de una persona?", options: ["Las máquinas no se corrigen", "Se repite a enorme velocidad y escala", "Solo afecta a las imágenes", "Nadie puede notarlo"] },
        { questionText: "¿Cuál es la mejor forma de usar la IA para los deberes?", options: ["Pedirle toda la respuesta", "Pedirle que explique la parte confusa", "Copiarla cambiando palabras", "Usarla cuando estés cansado"] },
        { questionText: "¿Qué pregunta te deja a ti el trabajo de pensar?", options: ["Escríbeme el trabajo sobre volcanes", "Explícame por qué sube el magma", "Dame la respuesta final", "Resuélveme este problema"] },
        { questionText: "¿Qué no debería entrar nunca en un chat de IA?", options: ["Una duda sobre tus deberes", "Tu dirección y tus contraseñas", "Una palabra que no entiendes", "Un tema que te da curiosidad"] },
        { questionText: "¿Por qué importa hacer tú el trabajo de pensar?", options: ["Es más rápido que usar la IA", "El esfuerzo es lo que te enseña", "Los profesores siempre lo notan", "La IA no se permite en clase"] }
      ]
    }},
  courseData: {
    "1": {
      title: "Python para Niños: ¡Crea tu Primer Juego!",
      desc: "Aprende a programar creando juegos reales. Perfecto para principiantes de 7 a 16 años. ¡Sumérgete en los fundamentos de Python y la mecánica de los juegos!",
      category: "Programación",
      difficulty: "Principiante",
      learningObjectives: [
        "Comprender los conceptos clave de programación",
        "Escribir scripts utilizando la sintaxis de Python",
        "Usar bucles, variables y lógica",
        "Construir un juego de texto totalmente jugable"
      ],
      prerequisites: ["Una computadora con acceso a internet", "Habilidades básicas de mecanografía"],
      modules: [
        {
          title: "Módulo 1: ¡Hola Python!",
          desc: "Aprende qué es Python y escribe tus primeras líneas de código.",
          contentSections: [
            { title: "Conoce a Alex el Inventor", content: "Alex tiene 11 años y le encantan los videojuegos. Un día pensó: ¿y si pudiera CREAR uno en vez de solo jugarlo? Su profesora le dijo que sí, que solo necesitaba Python. Esta también es tu historia." },
            { title: "¿Qué es Python?", content: "Python es un lenguaje para decirle a las computadoras qué hacer. Imagina un amigo robot que solo entiende Python. ¿Quieres que dibuje, baile o resuelva sumas? Escríbelo en Python. Se lee casi como el inglés." },
            { title: "¡Dato Curioso!", content: "¡Python no recibió su nombre por la serpiente! Fue nombrado por un divertido programa de comedia británico llamado 'Monty Python's Flying Circus'. El creador, Guido van Rossum, lo estaba viendo mientras programaba Python y pensó que el nombre era divertido." },
            { title: "Tu Primer Comando: print()", content: "print() muestra texto en la pantalla:\n\nprint('Hello World!')\n\nLa computadora escribe: Hello World!\n\nPuedes imprimir lo que quieras. Fíjate en las comillas: le dicen a Python que eso es texto, no un comando." },
            { title: "Consejo Pro: ¡No Olvides las Comillas!", content: "Un error muy común de los principiantes es olvidar las comillas alrededor del texto. Si escribes print(Hello) sin comillas, Python se confundirá y mostrará un error. ¡Envuelve siempre tu texto en comillas simples ('Hello') o dobles (\"Hello\") — ambas funcionan!" },
            { title: "¡Inténtalo Tú Mismo!", content: "Si tienes Python, ábrelo y escribe estas líneas una a una:\n\nprint('Hello World!')\nprint('My name is [TU NOMBRE]!')\nprint('Python is awesome!')\n\nAcabas de hacer hablar a una computadora." },
            { title: "Resumen del Módulo 1", content: "• Python es un lenguaje para dar instrucciones a las computadoras\n• Se llama así por un programa de humor, no por la serpiente\n• print() muestra texto en pantalla\n• El texto va entre comillas\n• Acabas de escribir código real" }
          ],
          exercises: [
            { question: "¿Qué es Python?", options: [ "Una app de dibujo para crear arte de videojuegos", "Un lenguaje de programación para hablar con las computadoras", "Un tipo de computadora que ejecuta juegos", "Una web donde se descargan videojuegos" ] },
            { question: "Python recibió su nombre por la serpiente." },
            { question: "El comando ___ muestra texto en la pantalla en Python." },
            { question: "¿Por qué necesitamos comillas alrededor del texto en print()?", options: ["Para que se vea bonito", "Para que Python sepa que es texto, no un comando", "Las comillas son opcionales", "Para agrandar el texto"] },
            { question: "Relaciona los términos de Python con sus significados:", pairs: [ { term: "Python", definition: "Un lenguaje de programación" }, { term: "print()", definition: "Muestra texto en la pantalla" }, { term: "Comillas", definition: "Envuelven el texto en el código" } ] }
          ]
        },
        {
          title: "Módulo 2: Variables y Tipos de Datos",
          desc: "Almacena números y texto en la memoria como un profesional.",
          contentSections: [
            { title: "Alex Necesita un Marcador", content: "El juego de Alex avanza, pero hay un problema: ¿cómo recuerda la computadora la puntuación del jugador? Cuando un jugador consigue 10 puntos, ¿a dónde va ese número? Alex necesita una forma de GUARDAR información. ¡Eso es exactamente lo que hacen las variables!" },
            { title: "¿Qué es una Variable?", content: "Una variable es una caja con etiqueta. Pon 10 en una caja llamada score y score vale 10.\n\nscore = 10\nplayer_name = 'Alex'\n\nEl = no significa igual. Significa pon este valor en esta caja." },
            { title: "Diferentes Tipos de Datos", content: "La computadora necesita saber QUÉ TIPO de cosa hay en cada caja:\n\nint — números enteros: 5, 42\nstr — texto entre comillas: 'Alex'\nfloat — decimales: 3.14\nbool — True o False\n\nPython deduce el tipo por ti." },
            { title: "Variables en Acción", content: "Así usa Alex las variables:\n\nscore = 0\nscore = score + 10\nprint('Score:', score)\n\nMuestra: Score: 10. Python mira el valor anterior, le suma 10 y guarda el nuevo en la caja." },
            { title: "¡Tu Cerebro Está Lleno de Variables!", content: "Tu cerebro hace lo mismo. Guarda una caja llamada mi_nombre con tu nombre, otra mi_edad y otra con tu color favorito. Simplemente nunca las llamaste variables." },
            { title: "Nombra Estas Cajas", content: "Escribe un buen nombre de variable para cada una: la mejor puntuación, cuántas vidas quedan, si la partida terminó. Luego revísalos: sin espacios, nunca empezando por número, y score no es lo mismo que Score." },
            { title: "Resumen del Módulo 2", content: "• Las variables son cajas con etiqueta que guardan datos\n• El = mete un valor en la caja\n• int, str, float y bool son los tipos principales\n• score = score + 10 actualiza una caja\n• Score y score son cajas distintas" }
          ],
          exercises: [
            { question: "¿Qué es una variable en programación?", options: ["Un tipo de mensaje de error", "Una caja etiquetada para guardar datos", "Una fórmula matemática", "Un comando de Python"] },
            { question: "Relaciona cada tipo de dato con su ejemplo:", pairs: [ { term: "Entero", definition: "El número 42" }, { term: "Cadena", definition: "El texto 'Hello'" }, { term: "Decimal", definition: "El número 3.14" }, { term: "Booleano", definition: "True o False" } ] },
            { question: "Si score = 4 + 6, el valor guardado en score es ___." },
            { question: "En Python, los nombres de variable 'Score' y 'score' son exactamente lo mismo." },
            { question: "¿Cuál de estos es un BUEN nombre de variable?", options: ["1player", "my score", "player_score", "p"] }
          ]
        },
        {
          title: "Módulo 3: Condicionales (if) y Lógica",
          desc: "Haz tu código inteligente con decisiones y condiciones.",
          contentSections: [
            { title: "El Juego de Alex Necesita un Cerebro", content: "El juego de Alex guarda la puntuación pero no reacciona. Aciertas y no pasa nada. El juego tiene que tomar una decisión, y para eso existe el if." },
            { title: "Tomar Decisiones con 'if'", content: "Un if ejecuta código solo cuando algo es verdad:\n\nif score > 100:\n    print('You win!')\n\nLa línea indentada solo se ejecuta si la puntuación pasa de 100. Si no, Python la salta." },
            { title: "Añadir 'else' y 'elif'", content: "else recoge todo lo que el if no cogió. elif comprueba otra condición antes:\n\nif score > 100:\n    print('Amazing!')\nelif score > 50:\n    print('Close!')\nelse:\n    print('Keep going!')" },
            { title: "¡Los Condicionales Están POR TODAS PARTES!", content: "Todas las apps que usas funcionan con esto. ¿Contraseña incorrecta? Un if. ¿Aviso de batería baja? Un if. ¿Pantalla de fin de partida? Un if comprobando si tus vidas llegaron a cero." },
            { title: "Operadores de Comparación", content: "Para escribir condiciones, necesitas operadores de comparación:\n\n>  significa 'mayor que'        (10 > 5 es True)\n<  significa 'menor que'        (3 < 7 es True)\n== significa 'igual a'          (5 == 5 es True)\n!= significa 'distinto de'      (5 != 3 es True)\n>= significa 'mayor o igual'    (10 >= 10 es True)\n<= significa 'menor o igual'    (4 <= 9 es True)\n\nFíjate: comprobar la igualdad usa == (doble igual), NO = (un solo igual). ¡El = simple es para asignar variables!" },
            { title: "Encuentra el Error", content: "Una de estas líneas no funcionará:\n\nif score > 10\n    print('Win')\n\nBusca qué falta al final de la primera línea. Python lo necesita para saber que empieza un bloque." },
            { title: "Resumen del Módulo 3", content: "• if ejecuta código solo cuando algo es verdad\n• else recoge todo lo que el if no cogió\n• elif comprueba otra condición\n• Los dos puntos y la indentación son obligatorios\n• Todas las apps están llenas de esto" }
          ],
          exercises: [
            { question: "¿Qué permiten hacer los condicionales (if) a un programa?", options: ["Colapsar la computadora", "Tomar decisiones según condiciones", "Solo imprimir texto", "Guardar variables"] },
            { question: "Cada línea de condicional (if) en Python debe terminar con dos puntos (:)." },
            { question: "Relaciona cada operador de comparación con su significado:", pairs: [ { term: ">", definition: "Mayor que" }, { term: "==", definition: "Igual a" }, { term: "!=", definition: "Distinto de" }, { term: "<", definition: "Menor que" } ] },
            { question: "La palabra clave ___ es la abreviatura de 'else if' en Python." },
            { question: "Si score es 75, ¿qué imprimirá este código?\nif score > 100:\n    print('Winner!')\nelif score > 50:\n    print('Almost there!')\nelse:\n    print('Keep going!')", options: ["Winner!", "Almost there!", "Keep going!", "Nada"] }
          ]
        },
        {
          title: "Módulo 4: ¡Crea un Juego de Adivinanzas!",
          desc: "¡Combina todo para crear tu primer juego real desde cero!",
          contentSections: [
            { title: "El Gran Momento de Alex", content: "Alex ya tiene variables, condicionales y un plan: un juego de adivinar. La computadora elige un número, tú adivinas y te dice mayor o menor. Todo lo de los tres módulos, en un juego." },
            { title: "¿Qué Son los Bucles?", content: "Un bucle repite código para que no lo escribas veinte veces:\n\nwhile guess != answer:\n    guess = int(input('Guess: '))\n\nSigue preguntando hasta acertar. != significa distinto de." },
            { title: "Obtener la Entrada del Usuario", content: "input() espera a que el jugador escriba y te lo devuelve como texto:\n\nname = input('Your name: ')\n\nSiempre texto. Para hacer cuentas con él, envuélvelo en int(): int(input('Guess: '))" },
            { title: "El Código Completo del Juego", content: "import random\n\nanswer = random.randint(1, 100)\nguess = 0\n\nwhile guess != answer:\n    guess = int(input('Guess: '))\n    if guess < answer:\n        print('Higher!')\n    elif guess > answer:\n        print('Lower!')\n\nprint('You got it!')" },
            { title: "Números Aleatorios en los Juegos", content: "import random te da random.randint(1, 100): un número distinto cada vez. Sin él la respuesta sería la misma en cada partida y nadie jugaría dos veces." },
            { title: "¡Mejora tu Juego!", content: "Añade un contador de intentos. Crea tries = 0, súmale 1 dentro del bucle y muéstralo al final. Luego prueba a limitar al jugador a seis intentos." },
            { title: "¡Resumen Final del Curso!", content: "• Las variables guardan tus datos\n• if, elif y else toman decisiones\n• Los bucles repiten el trabajo por ti\n• input() lee lo que escribe el jugador\n• random elige un número nuevo cada partida\n• Has creado un juego real y jugable" }
          ],
          exercises: [
            { question: "El comando ___ permite al jugador escribir una respuesta durante un juego." },
            { question: "¿Por qué usamos un bucle 'while' en el juego de adivinanzas?", options: [ "Para que la computadora elija un número nuevo cada turno", "Para dejar que el jugador adivine varias veces hasta acertar", "Para mostrarle al jugador todas las respuestas al empezar", "Para terminar el juego en cuanto falle el primer intento" ] },
            { question: "Si el número secreto es 5 y el jugador adivina 8, ¿qué debería decir el juego?", options: ["¡Muy bajo!", "¡Muy alto!", "¡Ganaste!", "¡Error!"] },
            { question: "La función input() siempre devuelve un número, así que nunca necesitas int()." },
            { question: "Relaciona cada concepto de Python con lo que hace en el juego:", pairs: [ { term: "bucle while", definition: "Se repite hasta que el jugador acierta" }, { term: "input()", definition: "Obtiene el intento del jugador" }, { term: "random.randint()", definition: "Elige el número secreto" }, { term: "if/elif/else", definition: "Comprueba si el intento es muy alto o bajo" } ] }
          ]
        }
      ]
    },
    "2": {
      title: "Magia Matemática: Acertijos y Lógica",
      desc: "Desarrolla el pensamiento crítico resolviendo acertijos, identificando patrones y dominando la lógica.",
      category: "Matemáticas",
      difficulty: "Todos los Niveles",
      learningObjectives: [
        "Dominar aritmética rápida y trucos mentales",
        "Resolver problemas de palabras de la vida real",
        "Entender patrones, lógica y secuencias"
      ],
      prerequisites: ["Matemáticas básicas de primaria", "Papel y lápiz para practicar"],
      modules: [
        {
          title: "Módulo 1: Patrones Numéricos",
          desc: "¡Descubre patrones secretos para predecir el futuro!",
          contentSections: [
            { title: "El Secreto del Descifrador", content: "El cofre estaba cerrado con un código: 2, 4, 6, 8, __. Los guardias no sabían qué hacer. Maya sonrió: suma 2 cada vez. Escribió 10 y se abrió. Los patrones son reglas disfrazadas." },
            { title: "La Magia de las Secuencias", content: "Una secuencia sigue una sola regla. Encuentra la regla y podrás predecir el siguiente número:\n\n+5: 5, 10, 15, 20...\n×2: 2, 4, 8, 16...\n-3: 20, 17, 14, 11..." },
            { title: "¡A la Naturaleza le Encanta Fibonacci!", content: "La secuencia de Fibonacci empieza así: 1, 1, 2, 3, 5, 8, 13... ¡donde cada número es la suma de los dos anteriores! ¡Los girasoles, las piñas, las conchas de mar e incluso los remolinos de las tormentas siguen exactamente esta secuencia!" },
            { title: "Encontrar la Regla Secreta", content: "Mira esta secuencia: 3, 6, 12, 24, __\n\n¿Cómo pasamos de 3 a 6? Multiplicamos por 2 (o sumamos 3).\n¿Cómo pasamos de 6 a 12? ¡Multiplicamos por 2! (Sumar 3 daría 9, así que la regla DEBE ser ×2).\nPor lo tanto, ¡24 × 2 = 48! ¡El número secreto es 48!" },
            { title: "Consejo Pro: Fíjate en las Diferencias", content: "Si te atascas con un patrón, resta los números adyacentes (6 - 3 = 3, 12 - 6 = 6). ¡Si las diferencias crecen, comprueba la multiplicación!" },
            { title: "Desafío del Detective de Patrones", content: "¿Puedes resolver estas dos secuencias secretas de cabeza?\n\n1) 1, 4, 9, 16, 25, __ (Pista: 1×1, 2×2, 3×3...)\n2) 100, 90, 80, 70, __ (Pista: Va bajando de...)\n\n¡Respuestas: 36 y 60!" },
            { title: "Resumen del Módulo 1", content: "Ideas clave:\n• Una secuencia sigue una regla fija (+, -, ×, ÷)\n• Comprueba tu regla en TODOS los números para asegurarte de que funciona\n• ¡Fibonacci (1,1,2,3,5,8...) está por todas partes en la naturaleza!\n• ¡Los patrones nos permiten predecir números futuros con un 100% de precisión!" }
          ],
          exercises: [
            { question: "¿Cuál es el siguiente número en: 5, 10, 15, 20...?", options: ["22", "25", "30", "100"] },
            { question: "En la secuencia 2, 4, 8, 16, el siguiente número es ___.", answer: "32" },
            { question: "La secuencia de Fibonacci (1, 1, 2, 3, 5, 8...) aparece en las semillas de girasol y las piñas." },
            { question: "Relaciona cada secuencia con su regla:", pairs: [ { term: "3, 6, 9, 12", definition: "Sumar 3" }, { term: "2, 4, 8, 16", definition: "Multiplicar por 2" }, { term: "50, 40, 30", definition: "Restar 10" } ] },
            { question: "¿Cómo llamamos a una lista de números que sigue una regla matemática?", options: ["Un desorden", "Una secuencia", "Una variable", "Un bucle"] }
          ]
        },
        {
          title: "Módulo 2: Geometría 2D y 3D",
          desc: "Explora formas en el espacio plano y en mundos 3D.",
          contentSections: [
            { title: "Diseñar Mundos de Minecraft", content: "¿Alguna vez te has preguntado cómo se construyen los juegos 3D como Minecraft o Roblox? Los desarrolladores empiezan con formas planas 2D — cuadrados y triángulos — y las extruyen en bloques 3D (cubos y pirámides). ¡La geometría es el motor secreto detrás de cada gráfico 3D que ves!" },
            { title: "Plano (2D) vs Sólido (3D)", content: "• Las formas 2D tienen Altura y Anchura (planas en el papel): Cuadrado, Círculo, Triángulo, Hexágono (6 lados).\n• Las formas 3D añaden Profundidad (sólidas en la mano): Cubo, Esfera, Pirámide, Cilindro." },
            { title: "Ángulos y Ángulos Rectos", content: "Un ángulo se forma donde se encuentran dos líneas. La esquina de un cuadrado es un ángulo de 90°, llamado Ángulo Recto. Mira a tu alrededor: ¡las puertas, los libros y las pantallas están llenos de ángulos rectos!" },
            { title: "Contar Lados y Vértices", content: "• Triángulo: 3 lados, 3 esquinas (vértices)\n• Cuadrado / Rectángulo: 4 lados, 4 vértices\n• Hexágono: 6 lados, 6 vértices\n• Octágono (señal de Stop): 8 lados, 8 vértices" },
            { title: "Secreto del Cubo", content: "¡Un cubo 3D tiene 6 caras cuadradas planas, 8 esquinas (vértices) y 12 aristas rectas!" },
            { title: "Caza de Formas", content: "Encuentra cinco cuerpos 3D en tu casa: una lata, una caja, una pelota, un cono, una pirámide. Para cada uno, di qué forma 2D verías si lo cortaras por la mitad." },
            { title: "Resumen del Módulo 2", content: "• 2D = plano (largo y ancho), 3D = sólido (largo, ancho y profundidad)\n• Los hexágonos tienen 6 lados, los octágonos tienen 8\n• Los ángulos de 90° son Ángulos Rectos\n• ¡Los cubos tienen 6 caras, 8 vértices y 12 aristas!" }
          ],
          exercises: [
            { question: "¿Cuántos lados tiene un hexágono?", options: ["4", "5", "6", "8"] },
            { question: "Un cuadrado en 3D se llama ___.", answer: "cubo" },
            { question: "Un ángulo recto mide exactamente 90 grados." },
            { question: "Relaciona la forma con su número de lados:", pairs: [ { term: "Triángulo", definition: "3 lados" }, { term: "Pentágono", definition: "5 lados" }, { term: "Hexágono", definition: "6 lados" }, { term: "Octágono", definition: "8 lados" } ] },
            { question: "¿Cuántas caras tiene un cubo estándar?", options: ["4", "6", "8", "12"] }
          ]
        },
        {
          title: "Módulo 3: Acertijos de Lógica",
          desc: "Resuelve misterios usando la deducción.",
          contentSections: [
            { title: "La Detective Maya y la Llave Perdida", content: "La llave dorada había desaparecido. Maya conocía tres hechos: 1) No está en el cofre rojo. 2) No está en una caja de madera. 3) El cofre azul es de metal. ¡Combinando las pistas, demostró que la llave DEBE estar en el cofre azul de metal! ¡Eso es la deducción!" },
            { title: "¿Qué es la Lógica Deductiva?", content: "La deducción significa eliminar las posibilidades incorrectas hasta que solo queda la verdad. ¡Si la afirmación A es Verdadera, entonces la afirmación B DEBE ser Verdadera!" },
            { title: "Resolver Acertijos de Orden", content: "Pista 1: Liam es más alto que Sam.\nPista 2: Sam es más alto que Zoe.\nConclusión: Liam > Sam > Zoe. ¡Por lo tanto, Liam es el más alto y Zoe la más baja!" },
            { title: "¡Dibuja una Cuadrícula!", content: "Cuando resuelvas acertijos de lógica con personas y objetos, haz una cuadrícula con marcas de verificación y X para descartar las opciones imposibles." },
            { title: "Engaña a un Amigo", content: "Inventa un acertijo donde la respuesta obvia sea la equivocada. Pruébalo con alguien. Si responde rápido y falla, tu despiste funcionó." },
            { title: "Resumen del Módulo 3", content: "• La lógica usa hechos para llegar a conclusiones 100% seguras\n• La deducción elimina las opciones incorrectas paso a paso\n• ¡Las pistas de orden ayudan a ordenar los objetos de mayor a menor!" }
          ],
          exercises: [
            { question: "Si A es más alto que B, y B es más alto que C, ¿quién es el más alto?", options: ["A", "B", "C", "Son iguales"] },
            { question: "La lógica deductiva significa adivinar al azar sin pruebas." },
            { question: "Usar pistas para eliminar respuestas incorrectas se llama razonamiento ___.", answer: "deductivo" },
            { question: "Tengo 4 patas pero no puedo caminar. ¿Qué soy?", options: ["Un perro", "Una silla", "Un pájaro", "Una serpiente"] },
            { question: "Relaciona la pista lógica con su resultado:", pairs: [ { term: "El gato no está en la Caja A ni B", definition: "Debe estar en la Caja C" }, { term: "Tom > Mark > Leo", definition: "Tom es el más alto" }, { term: "Todos los cuadrados son formas", definition: "Un cuadrado es una forma" } ] }
          ]
        },
        {
          title: "Módulo 4: Algoritmos y Resolución de Problemas",
          desc: "Aprende a resolver problemas enormes paso a paso.",
          contentSections: [
            { title: "El Sándwich de Mantequilla de Maní del Robot", content: "Dile a un robot que ponga mantequilla en el pan y puede aplastar el bote cerrado contra la barra. Tienes que decir: abre el bote, coge el cuchillo, saca, unta. Ese orden exacto es un algoritmo." },
            { title: "¿Qué es un Algoritmo?", content: "Un algoritmo es una lista de instrucciones precisa y ordenada para resolver un problema o completar una tarea." },
            { title: "Descomposición: Dividir Tareas Grandes", content: "Cuando se enfrentan a un problema enorme (como construir un cohete o crear un juego), los expertos usan la Descomposición: ¡dividir 1 problema enorme en 10 pasos pequeños y fáciles!" },
            { title: "Programa a un Humano", content: "Escribe los pasos para que alguien dibuje un cuadrado sin decir la palabra cuadrado. Léelos tal cual. Cada punto donde se equivoque es un paso que te dejaste." },
            { title: "Resumen del Módulo 4", content: "• Los algoritmos son recetas paso a paso\n• El orden importa: fuera de orden = fallo\n• ¡La descomposición divide las tareas grandes en pasos simples!" }
          ],
          exercises: [
            { question: "¿Qué es un algoritmo?", options: ["Un error matemático", "Un tipo de dinosaurio", "Una lista de instrucciones paso a paso", "Una figura 3D"] },
            { question: "En un algoritmo, cambiar el orden de los pasos no importa." },
            { question: "Dividir un problema grande en pasos pequeños se llama ___.", answer: "descomposición" },
            { question: "Relaciona los términos de algoritmos con su significado:", pairs: [ { term: "Algoritmo", definition: "Instrucciones paso a paso" }, { term: "Descomposición", definition: "Dividir tareas en partes pequeñas" }, { term: "Depuración", definition: "Corregir un error en los pasos" } ] },
            { question: "¿Cuál es la mejor forma de resolver un acertijo matemático enorme y difícil?", options: ["Dividirlo en pasos pequeños y sencillos", "Empezar por la parte más difícil e ir hacia atrás", "Hacerlo entero de cabeza y de una vez", "Saltar al resultado y comprobarlo después"] }
          ]
        }
      ]
    },
    "3": {
      title: "Dinero Inteligente: Niños y Efectivo",
      desc: "Desarrolla la educación financiera desde pequeño. Aprende sobre presupuestos, interés compuesto, banca e inversión inteligente.",
      category: "Finanzas",
      difficulty: "Principiante",
      learningObjectives: [
        "Comprender la historia del dinero",
        "Crear un presupuesto personal",
        "Entender el interés compuesto",
        "Aprender los conceptos básicos de inversión"
      ],
      prerequisites: ["Habilidades matemáticas básicas (porcentajes, suma)"],
      modules: [
        {
          title: "Módulo 1: ¿Qué es el Dinero?",
          desc: "Aprende por qué se inventó el dinero y cómo funcionaba el trueque.",
          contentSections: [
            { title: "Cambiar Gallinas por Espadas", content: "Sam tenía una gallina y quería una espada, así que tenía que encontrar un herrero que quisiera una gallina. Si el herrero quería manzanas, no había trato. El dinero existe porque eso casi nunca coincidía." },
            { title: "Antes del Dinero: El Trueque", content: "El trueque es intercambiar bienes o servicios directamente sin dinero. El dinero resolvió el trueque porque sirve como medio de intercambio universal." },
            { title: "Dato Curioso: ¡Conchas y Sal como Dinero!", content: "¡Antes del papel moneda, la gente usaba conchas de cauri, piedras gigantes e incluso sal como dinero! ¡De hecho, la palabra 'salario' viene de la palabra latina para sal ('sal')!" },
            { title: "Pon Precio a Tres Cosas", content: "Elige tres cosas de tu cuarto. Escribe por qué cambiarías cada una si no existiera el dinero. Fíjate en lo difícil que es encontrar un trato justo: ese es el problema que resolvió el dinero." },
            { title: "Resumen del Módulo 1", content: "• Trueque = intercambiar objetos directamente\n• Dinero = medio de intercambio universal\n• ¡El dinero solo funciona porque todos aceptan que tiene valor!" }
          ],
          exercises: [
            { question: "¿Qué es el trueque?", options: ["Usar tarjetas de crédito", "Intercambiar bienes directamente sin dinero", "Invertir en acciones", "Ahorrar en un banco"] },
            { question: "El dinero solo funciona si todos aceptan que tiene valor." },
            { question: "La palabra salario viene de la palabra latina para ___.", answer: "sal" },
            { question: "Relaciona los términos de dinero con sus definiciones:", pairs: [ { term: "Trueque", definition: "Intercambiar bienes directamente" }, { term: "Moneda", definition: "Dinero usado en un país" }, { term: "Medio de Intercambio", definition: "Algo usado para comprar bienes" } ] },
            { question: "¿Por qué se inventó el dinero?", options: ["Porque las monedas brillan", "Para hacer el comercio más fácil que el trueque", "Para hacer las carteras pesadas", "Porque las gallinas se escaparon"] }
          ]
        },
        {
          title: "Módulo 2: Presupuestos y Ahorro",
          desc: "Dile a tu dinero a dónde ir en lugar de preguntarte a dónde se fue.",
          contentSections: [
            { title: "Ingresos vs Gastos", content: "• Ingresos = Dinero que ENTRA (paga semanal, regalos de cumpleaños, tareas).\n• Gastos = Dinero que SALE (comprar juguetes, snacks, juegos).\n• Presupuesto = ¡Un plan para asegurar que los Gastos sean MENORES que los Ingresos!" },
            { title: "La Regla 50/30/20", content: "Una forma famosa de hacer un presupuesto:\n• 50% para Necesidades (comida, material escolar)\n• 30% para Deseos (juegos, juguetes)\n• 20% para Ahorros (¡metas futuras!)" },
            { title: "Haz un Presupuesto Pequeño", content: "Imagina que recibes 10 a la semana. Anota cuánto va a gastar, cuánto a ahorrar y cuánto a dar. Los tres tienen que sumar 10 exactos. Eso es un presupuesto." },
            { title: "Resumen del Módulo 2", content: "• Los ingresos son dinero que entra; los gastos son dinero que sale\n• ¡Gasta siempre menos de lo que ganas para acumular riqueza!" }
          ],
          exercises: [
            { question: "El dinero que ENTRA a tu bolsillo se llama:", options: ["Gasto", "Ingreso", "Impuesto", "Deuda"] },
            { question: "Un buen presupuesto significa que tus gastos son mayores que tus ingresos." },
            { question: "El dinero que SALE cuando compras algo se llama un ___.", answer: "gasto" },
            { question: "Relaciona las categorías del presupuesto:", pairs: [ { term: "Ingreso", definition: "Paga ganada" }, { term: "Necesidad", definition: "Material escolar" }, { term: "Deseo", definition: "Aspecto para un videojuego" }, { term: "Ahorro", definition: "Dinero en el banco para el futuro" } ] },
            { question: "¿Cuál es la Regla de Oro del dinero?", options: ["Gasta todo tu dinero", "Gasta menos de lo que ganas", "Nunca ahorres", "Compra todo en oferta"] }
          ]
        },
        {
          title: "Módulo 3: La Magia del Interés Compuesto",
          desc: "El multiplicador mágico que convierte pequeños ahorros en fortunas.",
          contentSections: [
            { title: "Interés sobre Interés", content: "Cuando depositas dinero en un banco, el banco te paga 'Interés'. ¡El interés compuesto significa que ganas interés sobre tu dinero Y sobre el interés que ya has ganado! ¡Se multiplica con el tiempo como una bola de nieve rodando montaña abajo!" },
            { title: "La Cita de Albert Einstein", content: "Albert Einstein llamó célebremente al interés compuesto 'la 8ª maravilla del mundo. ¡Quien lo entiende, lo gana... quien no, lo paga!'" },
            { title: "Duplícalo Tú Mismo", content: "Empieza con 100. Súmale un 10% y anota el total. Súmale otro 10% al nuevo total, y otra vez, cinco veces. Compara tu resultado con 150 y mira cuánto lo pasaste." },
            { title: "Resumen del Módulo 3", content: "• Interés = bonificación pagada por el banco por ahorrar\n• Interés compuesto = interés sobre el interés\n• ¡El tiempo es el multiplicador secreto!" }
          ],
          exercises: [
            { question: "Cuando un banco te paga dinero extra por mantener tus ahorros con ellos, se llama:", options: ["Impuestos", "Interés", "Multas", "Préstamos"] },
            { question: "El interés compuesto significa que ganas interés además del interés anterior." },
            { question: "El interés compuesto funciona mejor cuando dejas tu dinero ahorrado durante ___ tiempo.", answer: "mucho" },
            { question: "Relaciona los conceptos de interés:", pairs: [ { term: "Interés Simple", definition: "Interés solo sobre el dinero inicial" }, { term: "Interés Compuesto", definition: "Interés sobre el interés con el tiempo" }, { term: "Depósito Bancario", definition: "Poner dinero en una cuenta" } ] },
            { question: "¿Quién llamó al interés compuesto la 8ª maravilla del mundo?", options: ["Isaac Newton", "Albert Einstein", "Steve Jobs", "Elon Musk"] }
          ]
        },
        {
          title: "Módulo 4: Inversión y Acciones",
          desc: "Haz que tu dinero trabaje para que tú no tengas que hacerlo.",
          contentSections: [
            { title: "¿Qué es una Acción?", content: "Cuando una empresa (como Apple o Disney) quiere expandirse, divide la propiedad en millones de pequeñas partes llamadas 'Acciones'. ¡Cuando compras una acción, te conviertes en un micro-propietario de esa empresa!" },
            { title: "Diversificación: ¡No pongas todos los huevos en 1 cesta!", content: "Si compras acciones de solo 1 empresa y quiebra, pierdes dinero. ¡Si inviertes en 10 empresas diferentes, estás a salvo si una tiene un mal día!" },
            { title: "Elige una Acción de Mentira", content: "Escoge una empresa que uses de verdad. Escribe una razón por la que podría valer más dentro de cinco años y otra por la que podría valer menos. Eso es lo que hacen los inversores." },
            { title: "Resumen del Módulo 4", content: "• Acción = pequeña parte de propiedad de una empresa\n• La inversión hace crecer el dinero con el tiempo\n• ¡Diversifica para reducir el riesgo!" }
          ],
          exercises: [
            { question: "Cuando compras una acción, ¿qué estás comprando en realidad?", options: [ "Una promesa de que la empresa te devolverá el dinero", "Una pequeña parte de la propiedad de una empresa real", "Un descuento en todo lo que vende esa empresa", "Un boleto que te deja votar por el director" ] },
            { question: "Invertir no tiene ningún riesgo y siempre garantiza ganancias." },
            { question: "Repartir tus inversiones entre varias empresas se llama ___.", answer: "diversificación" },
            { question: "Relaciona los términos de inversión:", pairs: [ { term: "Acción", definition: "Parte de la propiedad de una empresa" }, { term: "Dividendo", definition: "Ganancia de la empresa repartida a los inversores" }, { term: "Cartera", definition: "Conjunto de todas tus inversiones" } ] },
            { question: "¿Cuál es el objetivo principal de invertir?", options: ["Perder dinero", "Hacer crecer tu dinero con el tiempo", "Guardar el dinero bajo el colchón", "Pagar comisiones"] }
          ]
        }
      ]
    },
    "4": {
      title: "Creadores del Futuro: Marketing Digital",
      desc: "Domina la marca, la narración, la creación de contenido y la seguridad en línea.",
      category: "Marketing",
      difficulty: "Intermedio",
      learningObjectives: [
        "Construir una identidad de marca sólida",
        "Estructurar narrativas atractivas",
        "Entender la ciudadanía digital",
        "Diseñar una campaña simulada"
      ],
      prerequisites: ["Familiaridad con redes sociales"],
      modules: [
        {
          title: "Módulo 1: Marca e Identidad",
          desc: "Aprende cómo las empresas construyen personalidades reconocibles.",
          contentSections: [
            { title: "Los Dos Carteles de Sam", content: "Sam hizo dos carteles para la misma venta de pasteles del colegio. Uno en rosa redondeado, otro en negro afilado. Mismas palabras, mismos pasteles. Todos dijeron que el rosa parecía más simpático. Los pasteles no habían cambiado." },
            { title: "Una Marca Es un Sentimiento", content: "Una marca no es el logo. Es lo que la gente espera antes de haber probado nada. Los colores, las tipografías y el tono fijan esa expectativa, y la fijan en un segundo." },
            { title: "Por Qué los Bancos Son Azules", content: "Mira logos que conoces:\n\nRojo — apetito y urgencia (McDonald's, Netflix)\nAzul — confianza y calma (Samsung, PayPal)\nVerde — naturaleza y crecimiento (Spotify, Starbucks)\n\nCasi ningún banco usa rojo intenso. Casi ninguna bebida energética usa azul suave. No lo adivinan: eligen primero el sentimiento." },
            { title: "Elige Primero el Sentimiento", content: "Antes de elegir un color, escribe una palabra sobre cómo quieres que se sienta la gente: segura, emocionada, deportiva, elegante. Elige el color para esa palabra. Hacerlo al revés es por lo que los diseños salen aleatorios." },
            { title: "Ponle Nombre al Sentimiento", content: "Busca tres logos en cosas que tengas cerca. Para cada uno escribe la primera palabra que se te ocurra y luego su color principal. Busca el patrón entre ambos. Verás las mismas parejas una y otra vez." },
            { title: "Resumen del Módulo 1", content: "• Una marca es un sentimiento, no un logo\n• El color y la tipografía lo fijan en un segundo\n• El rojo urge, el azul tranquiliza, el verde crece\n• Elige el sentimiento antes que el color" }
          ],
          exercises: [
            { question: "¿Qué es una marca?", options: [ "La lista de productos que vende hoy una empresa", "El sentimiento, la personalidad y la reputación de una empresa", "El nombre legal con el que se registra la empresa", "La combinación de colores impresa en sus envases" ] },
            { question: "Las empresas eligen los colores al azar sin pensar en las emociones." },
            { question: "El color azul se usa a menudo en los logos para generar ___.", answer: "confianza" },
            { question: "Relaciona los elementos de marca:", pairs: [ { term: "Logo", definition: "Símbolo visual de la marca" }, { term: "Eslogan", definition: "Frase pegadiza (p. ej. Just Do It)" }, { term: "Paleta", definition: "Conjunto específico de colores de la marca" } ] },
            { question: "¿Cuál de estos forma parte de una identidad de marca?", options: ["Logos, colores y tipografía", "Muebles de oficina", "La talla de zapato de los empleados", "Formularios de impuestos"] }
          ]
        },
        {
          title: "Módulo 2: La Narración en el Marketing",
          desc: "Engancha a tu audiencia con grandes historias.",
          contentSections: [
            { title: "Nadie Leyó la Publicación de Sam", content: "Sam escribió sobre la venta de pasteles: cuánto costó organizarla, quién estaba en el comité, cuántas reuniones hubo. La leyeron tres personas. Ninguna fue." },
            { title: "El Cliente Es el Héroe", content: "Quien lee es el héroe de la historia. Lo tuyo es el guía que le ayuda a ganar. La medalla se la lleva Luke, no Yoda. Escribe sobre lo que consigue, no sobre ti." },
            { title: "La Misma Venta, Reescrita", content: "Antes: «Nuestro comité pasó seis semanas organizando esto.»\n\nDespués: «Llévate un brownie calentito por 50 céntimos en el recreo, y tu dinero compra libros para la biblioteca.»\n\nLa segunda no habla de Sam. Dice qué consigues y para qué sirve. Esa versión llenó la mesa." },
            { title: "Cuenta tus Nosotros", content: "Lee lo que escribiste y cuenta cuántas veces dices nosotros, nuestro o yo, y cuántas dices tú. Si gana el primer número, reescríbelo. Esta comprobación arregla casi cualquier publicación floja." },
            { title: "Dale la Vuelta a una Frase", content: "Busca un anuncio o un cartel cerca de ti. Copia una frase. Ahora reescríbela para que empiece por Tú y diga qué consigue quien lee. Léelas las dos en voz alta." },
            { title: "Resumen del Módulo 2", content: "• Quien lee es el héroe, lo tuyo es el guía\n• Di qué consigue, no qué hiciste tú\n• Cuenta tus nosotros frente a tus tú\n• La primera línea decide si leen el resto" }
          ],
          exercises: [
            { question: "En la narración de marca, ¿quién es el Héroe?", options: ["El director", "El producto", "El cliente", "El competidor"] },
            { question: "Los vídeos en línea necesitan un buen gancho en los primeros 3 segundos." },
            { question: "En la narración de marketing, tu producto actúa como el ___ para ayudar al héroe a ganar.", answer: "guía" },
            { question: "Relaciona los componentes de la historia:", pairs: [ { term: "Héroe", definition: "El Cliente" }, { term: "Guía", definition: "Tu Producto/Servicio" }, { term: "Gancho", definition: "Los primeros 3 segundos que captan la atención" } ] },
            { question: "¿Por qué los especialistas en marketing usan la narración?", options: ["Para aburrir a la gente", "Para crear una conexión emocional", "Para rellenar espacio en blanco", "Para confundir a los lectores"] }
          ]
        },
        {
          title: "Módulo 3: Ciudadanía Digital y Seguridad",
          desc: "Protege tu huella digital.",
          contentSections: [
            { title: "La Foto Que Sam Borró", content: "Sam publicó una foto del cartel pegado en la verja del colegio. El nombre del centro se leía. Sam la borró una hora después. Dos amigos ya le habían hecho captura." },
            { title: "Borrar No Es Deshacer", content: "Tu huella digital es todo lo que dejas en línea. Borrar quita tu copia, no la de los demás. Las capturas, los reenvíos y las copias de seguridad sobreviven. Da por hecho que lo que publicas es permanente." },
            { title: "Qué No Enseñar", content: "Cosas que te identifican en la vida real:\n\nTu dirección o carteles de calles\nEl nombre, el escudo o el uniforme del colegio\nTu teléfono, aunque salga en una foto\nTu horario o tu ruta diaria\n\nCasi todo esto se comparte sin querer, en el fondo de una foto, no escrito a propósito." },
            { title: "Mira el Fondo", content: "Antes de publicar una foto, mira más allá de ti: números de portal, paradas de autobús, el logo del colegio en una sudadera. El sujeto suele ser seguro. El fondo es lo que te delata." },
            { title: "Revisa una Foto", content: "Abre una foto del móvil que podrías haber publicado. Anota todo lo que podría decirle a un desconocido dónde vives o dónde estudias. Decide si aun así la publicarías." },
            { title: "Resumen del Módulo 3", content: "• Tu huella es todo lo que dejas en línea\n• Borrar tu copia no borra la suya\n• Dirección, colegio y horario te identifican\n• Casi todas las filtraciones vienen del fondo" }
          ],
          exercises: [
            { question: "¿Qué es tu Huella Digital?", options: [ "El espacio que ocupan tus fotos en el móvil", "El rastro permanente de datos que dejas en línea", "La velocidad a la que va tu conexión a internet", "La cantidad de apps instaladas en tu teléfono" ] },
            { question: "Cualquier cosa que publiques en línea se puede borrar fácilmente para siempre." },
            { question: "PII significa Información Personal ___.", answer: "identificable" },
            { question: "Relaciona los términos de seguridad:", pairs: [ { term: "PII (Info personal)", definition: "Dirección, teléfono, nombre completo" }, { term: "Seguro de Compartir", definition: "Dibujos, reseñas, aficiones" }, { term: "Huella Digital", definition: "Rastro del historial en línea" } ] },
            { question: "¿Cuál de los siguientes NUNCA debe publicarse públicamente en línea?", options: ["Película favorita", "Dirección de casa", "Dibujo de un gato", "Reseña de un libro"] }
          ]
        },
        {
          title: "Módulo 4: Campañas de Marketing y CTA",
          desc: "Lanza tu gran idea con una llamada a la acción clara.",
          contentSections: [
            { title: "Gustó a Todos y No Vino Nadie", content: "El cartel nuevo de Sam quedó genial y se lo dijeron. La mesa siguió vacía. El cartel nunca decía dónde era la venta, a qué hora empezaba ni qué había que hacer. Que guste no es aparecer." },
            { title: "Diles el Siguiente Paso", content: "Una llamada a la acción es una instrucción clara: qué hacer, dónde y cuándo. Sin ella la gente te da la razón y sigue andando. Que esté bien no es lo mismo que esté claro." },
            { title: "Vago Frente a Concreto", content: "Vago: «¡Apoya la venta de pasteles!»\n\nConcreto: «Ven al salón de actos el viernes a las 12:45. Trae 50 céntimos.»\n\nLa segunda da un lugar, una hora y una cantidad. Cada una de esas cosas quita una excusa para no ir. La mejor llamada a la acción es la más fácil de obedecer." },
            { title: "Una Acción, No Cuatro", content: "Síguenos, suscríbete, díselo a un amigo y ven son cuatro tareas, así que casi nadie hace ninguna. Elige la única que de verdad importa y pide solo esa." },
            { title: "Arregla una Floja", content: "Busca un anuncio que acabe con algo vago como Más información. Reescríbelo con un lugar, una hora y una acción. Léeselo a alguien y pregúntale qué se supone que tiene que hacer." },
            { title: "Resumen del Módulo 4", content: "• Una llamada a la acción es una instrucción clara\n• Da un lugar, una hora y una cantidad\n• Lo concreto gana a lo entusiasta\n• Pide una cosa, no cuatro" }
          ],
          exercises: [
            { question: "¿Qué significa CTA?", options: ["Llamada a la Acción (Call To Action)", "Alineación central del texto", "Costo de publicidad", "Clic para añadir"] },
            { question: "'¡Suscríbete para más vídeos!' es un ejemplo de una CTA." },
            { question: "El grupo específico de personas para el que diseñas una campaña se llama el ___ objetivo.", answer: "público" },
            { question: "Relaciona los términos de campaña:", pairs: [ { term: "CTA", definition: "Llamada a la Acción" }, { term: "Público Objetivo", definition: "Espectadores/compradores previstos" }, { term: "Campaña", definition: "Estrategia de marketing organizada" } ] },
            { question: "¿Cuál es una Llamada a la Acción eficaz?", options: ["'Existimos.'", "'¡Suscríbete hoy para recibir consejos gratis!'", "'Los colores son bonitos.'", "'Adiós.'"] }
          ]
        }
      ]
    },
    "5": {
      title: "Maravillas Web: HTML y CSS",
      desc: "Domina los lenguajes de marcado y estilo que dan vida a internet.",
      category: "Ciencia",
      difficulty: "Principiante",
      learningObjectives: [
        "Escribir marcado semántico en HTML5",
        "Estilizar páginas con CSS moderno",
        "Entender el modelo de caja en CSS",
        "Publicar tu sitio web"
      ],
      prerequisites: ["Una computadora con navegador web"],
      modules: [
        {
          title: "Módulo 1: Estructura HTML",
          desc: "El esqueleto de cada sitio web.",
          contentSections: [
            { title: "El Borrón Gris de Maya", content: "Maya escribió sus trucos de skate en un archivo y lo abrió en el navegador. Salió un borrón gris. Sin títulos, sin enlaces: el navegador no tenía ni idea de qué era cada cosa." },
            { title: "Las Etiquetas le Dicen al Navegador Qué Es Cada Cosa", content: "Una etiqueta HTML es un rótulo. Envuelves tu texto en ella y el navegador por fin sabe: esto es un título, eso es un párrafo. Van en pareja: <p> abre, </p> cierra." },
            { title: "La Página de Maya, Arreglada", content: "Maya envuelve sus palabras en etiquetas:\n\n<h1>Los Trucos de Maya</h1>\n<p>Mi mejor truco es un kickflip.</p>\n<a href=\"tricks.html\">Verlos todos</a>\n\nAhora el navegador sabe qué hacer: un título grande en negrita, un párrafo normal y un enlace azul que puedes pulsar. Las mismas palabras, una página completamente distinta." },
            { title: "La Primera Web Todavía Funciona", content: "El primer sitio web del mundo se publicó en 1991. Solo texto y enlaces, sin colores ni imágenes. Sigue en línea hoy y carga perfectamente en cualquier navegador moderno." },
            { title: "Constrúyelo: Te Toca", content: "Crea un archivo llamado me.html. Pon tu nombre en un <h1>, algo que te encante en un <p> y un enlace a cualquier sitio en un <a>. Ábrelo en tu navegador y míralo funcionar." },
            { title: "Resumen del Módulo 1", content: "• Una etiqueta dice QUÉ es tu contenido\n• Van en pareja: <p> abre, </p> cierra\n• <h1> es el título principal, <p> un párrafo, <a> un enlace\n• El navegador solo sabe lo que tus etiquetas le dicen" }
          ],
          exercises: [
            { question: "¿Qué proporciona HTML a una página web?", options: ["Colores y estilos", "La estructura básica (esqueleto)", "Almacenamiento en base de datos", "El backend del servidor"] },
            { question: "Los nombres de las etiquetas HTML van entre corchetes angulares como <p>." },
            { question: "La etiqueta usada para el texto de párrafo en HTML es ___.", answer: "<p>" },
            { question: "Relaciona las etiquetas HTML con su propósito:", pairs: [ { term: "<h1>", definition: "Encabezado principal" }, { term: "<p>", definition: "Texto de párrafo" }, { term: "<a>", definition: "Hipervínculo" }, { term: "<img>", definition: "Etiqueta de imagen" } ] },
            { question: "¿Qué etiqueta produce el encabezado más grande?", options: ["<p>", "<h1>", "<h6>", "<div>"] }
          ]
        },
        {
          title: "Módulo 2: Estilo con CSS",
          desc: "Añade colores, fuentes y belleza.",
          contentSections: [
            { title: "La Página de Maya Se Ve Aburrida", content: "La página de Maya ya funciona, pero es texto negro sobre blanco con una fuente antigua. Su amiga le pregunta si es una ficha del colegio. Maya quiere que se vea SUYA." },
            { title: "CSS Viste al Esqueleto", content: "HTML dice qué son las cosas. CSS dice cómo se ven. Eliges un elemento y le pones propiedades: un color, un tamaño, un fondo. Cada una es propiedad: valor;" },
            { title: "Tres Líneas Que Lo Cambian Todo", content: "Maya añade un bloque de estilo:\n\nh1 {\n  color: hotpink;\n  font-size: 40px;\n}\n\nTodos los <h1> de la página se vuelven rosa fuerte y crecen. Escribió tres líneas y cambió todos los títulos a la vez: de eso trata CSS." },
            { title: "El Punto y Coma Pilla a Todo el Mundo", content: "Cada línea de CSS termina en punto y coma. Si olvidas uno, el navegador ignora esa línea y la siguiente sin avisar. Nada se rompe, nada te avisa: tu estilo simplemente no aparece." },
            { title: "Hazla Tuya", content: "Abre tu me.html y añade un bloque de estilo. Dale a tu <h1> un color que te guste y a tu <p> un font-size de 18px. Recarga la página. Cambia el color tres veces y míralo actualizarse." },
            { title: "Resumen del Módulo 2", content: "• HTML es QUÉ son las cosas, CSS es cómo SE VEN\n• Las reglas son propiedad: valor;\n• Una regla da estilo a todos los elementos que coinciden\n• Un punto y coma que falta mata la línea en silencio" }
          ],
          exercises: [
            { question: "¿Qué hace CSS?", options: ["Construye las etiquetas HTML básicas", "Da estilo a las páginas con colores y fuentes", "Guarda las cuentas de usuario", "Alimenta las bases de datos"] },
            { question: "Los nombres de las propiedades CSS terminan con dos puntos (:)." },
            { question: "En CSS, para poner el texto en rojo escribes color: ___;", answer: "red" },
            { question: "Relaciona las propiedades CSS:", pairs: [ { term: "color", definition: "Color del texto" }, { term: "font-size", definition: "Tamaño del texto" }, { term: "background-color", definition: "Color de fondo" } ] },
            { question: "¿Cómo cambias el color del texto en CSS?", options: ["text: red;", "color: red;", "font-color: red;", "paint: red;"] }
          ]
        },
        {
          title: "Módulo 3: El Modelo de Caja de CSS",
          desc: "Domina el espaciado: Contenido, Relleno, Borde, Margen.",
          contentSections: [
            { title: "Todo Está Apretujado", content: "El texto de Maya toca el borde de su caja y sus párrafos están pegados entre sí. Se ve apretado. Necesita espacio, pero el espacio por dentro y el de por fuera son dos cosas distintas." },
            { title: "Cada Elemento Es una Caja", content: "En CSS todo es un rectángulo con cuatro capas: el contenido, el relleno a su alrededor dentro del borde, el borde en sí, y el margen por fuera empujando a los demás." },
            { title: "Relleno Frente a Margen", content: "Piensa en una foto enmarcada:\n\n.card {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 30px;\n}\n\nEl relleno es el paspartú entre la foto y el marco. El margen es la pared entre este marco y el siguiente. El relleno agranda la caja; el margen separa las cajas." },
            { title: "Usa el Inspector", content: "Haz clic derecho en cualquier página y elige Inspeccionar. El navegador dibuja el modelo de caja en colores: verde para el relleno, naranja para el margen. Cada sitio que te gusta usa esas mismas cuatro capas." },
            { title: "Encuentra las Capas", content: "Abre cualquier web, haz clic derecho en un botón y elige Inspeccionar. Busca su padding y su margin en el panel. Cambia el número del padding y mira crecer el botón real de la página." },
            { title: "Resumen del Módulo 3", content: "• Cada elemento es una caja de cuatro capas\n• El relleno es espacio DENTRO del borde\n• El margen es espacio FUERA, que empuja a los demás\n• Inspeccionar te muestra las capas en cualquier sitio" }
          ],
          exercises: [
            { question: "En el Modelo de Caja de CSS, ¿qué es el espacio DENTRO del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
            { question: "El margen (margin) crea espacio FUERA del borde del elemento." },
            { question: "El espacio dentro de un elemento, entre el contenido y el borde, se llama ___ (en inglés).", answer: "padding" },
            { question: "Relaciona las capas del Modelo de Caja:", pairs: [ { term: "Contenido", definition: "Texto o imagen dentro" }, { term: "Relleno (Padding)", definition: "Espacio dentro del borde" }, { term: "Borde", definition: "Línea que rodea el relleno" }, { term: "Margen (Margin)", definition: "Espacio fuera del borde" } ] },
            { question: "¿Cómo se llama el espacio FUERA del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] }
          ]
        },
        {
          title: "Módulo 4: Despliegue y Alojamiento Web",
          desc: "Comparte tu sitio con el mundo.",
          contentSections: [
            { title: "Solo Funciona en el Portátil de Maya", content: "Maya le enseña la página a una amiga girando el portátil. Para enviársela le manda el archivo, y se abre sin nada de estilo. Una web que nadie puede visitar no es del todo una web." },
            { title: "Un Servidor Es una Computadora Que Nunca Duerme", content: "Tu archivo vive en tu portátil, que se apaga y cambia de dirección. Un alojamiento es una computadora que sigue encendida, guarda tus archivos y responde a quien los pida, de día y de noche." },
            { title: "De Carpeta a Dirección", content: "Maya arrastra su carpeta a un alojamiento gratuito. Contiene:\n\nindex.html\nstyle.css\n\nMinutos después tiene una dirección real que puede mandar a cualquiera. El servidor busca index.html primero: por eso la página de inicio casi siempre se llama así." },
            { title: "Toda Web Son Solo Archivos", content: "Los sitios más grandes que usas siguen siendo carpetas de archivos en algún servidor. Tienen más archivos y máquinas más rápidas, pero el navegador los pide igual que pide los tuyos." },
            { title: "Publica la Tuya", content: "Renombra tu me.html a index.html. Ponlo en una carpeta junto a tu archivo CSS. Sube la carpeta a cualquier alojamiento gratuito y manda la dirección a alguien. Tu sitio ya está en internet." },
            { title: "Resumen del Módulo 4", content: "• Tu portátil no puede alojar un sitio: se apaga\n• Un alojamiento sigue encendido y responde peticiones\n• La página de inicio se llama index.html\n• Toda web son archivos en un servidor" }
          ],
          exercises: [
            { question: "¿Qué es un servidor web?", options: [ "Un programa que convierte el HTML en diseño", "Una computadora que permanece en línea 24/7 alojando archivos", "La carpeta de tu portátil donde viven los archivos", "Una pestaña que mantiene abierta una página web" ] },
            { question: "Desplegar un sitio web significa ponerlo en un servidor para que el mundo pueda visitarlo." },
            { question: "La dirección web que la gente escribe para visitar tu sitio se llama ___.", answer: "url" },
            { question: "Relaciona los términos de alojamiento:", pairs: [ { term: "Servidor", definition: "Computadora en línea 24/7" }, { term: "URL", definition: "Dirección web" }, { term: "Desplegar", definition: "Publicar el código en vivo" } ] },
            { question: "¿Qué escriben los visitantes para acceder a tu sitio web?", options: ["Una URL", "Una memoria USB", "Una contraseña", "Un archivo de texto"] }
          ]
        }
      ]
    },
    "6": {
      title: "Arte Digital: Dibuja en tu Pantalla",
      desc: "Da rienda suelta a tu creatividad con técnicas de arte digital.",
      category: "Artes",
      difficulty: "Todos los Niveles",
      learningObjectives: [
        "Navegar en software de lienzo digital",
        "Aplicar teoría de color avanzada",
        "Estructurar poses dinámicas de personajes",
        "Renderizar y pulir ilustraciones"
      ],
      prerequisites: ["Una tableta de dibujo digital"],
      modules: [
        {
          title: "Módulo 1: Capas y Arte No Destructivo",
          desc: "Dibuja sin miedo a arruinar tu trabajo.",
          contentSections: [
            { title: "Rhea Borra Dos Horas", content: "Rhea pasó dos horas con un boceto de dragón y empezó a colorear. Un golpe de goma y el ala desapareció: boceto y color a la vez. Lo había dibujado todo en una sola capa." },
            { title: "Las Capas Son Láminas de Vidrio", content: "Una capa es una lámina transparente sobre tu lienzo. Boceta en la de abajo, entinta en la siguiente, colorea encima. Borra la de arriba y todo lo de debajo queda intacto." },
            { title: "Las Tres Láminas de Rhea", content: "Rhea rehace el dragón:\n\nCapa 3 — color\nCapa 2 — líneas limpias\nCapa 1 — boceto\n\nOculta la Capa 1 y las líneas del boceto desaparecen de la vista sin borrarse. Puede volver a mostrarlas cuando quiera. Eso es trabajar de forma no destructiva." },
            { title: "Ponles Nombre Sobre la Marcha", content: "Todas las apps llaman a las capas Capa 1, Capa 2, Capa 3. Con diez dibujadas no recordarás cuál es cuál. Renómbralas en cuanto las crees: boceto, líneas, piel, sombras." },
            { title: "Compruébalo Tú Misma", content: "Crea dos capas. Garabatea en la de abajo y luego encima en la de arriba. Borra del todo el garabato de arriba. Mira cómo el de abajo sobrevive intacto." },
            { title: "Resumen del Módulo 1", content: "• Una capa es una lámina transparente sobre el lienzo\n• Borrar una capa nunca toca las de debajo\n• Ocultar una capa no es borrarla\n• Nombra las capas según las creas" }
          ],
          exercises: [
            { question: "¿A qué se parecen las capas del arte digital?", options: ["Rocas pesadas", "Láminas de vidrio transparentes apiladas", "Una sola hoja de papel", "Un pincel"] },
            { question: "Borrar en la Capa 2 elimina tu dibujo en la Capa 1." },
            { question: "Dibujar en capas separadas evita arruinar tu boceto; a esto se le llama arte no ___.", answer: "destructivo" },
            { question: "Relaciona los tipos de capa:", pairs: [ { term: "Capa de Boceto", definition: "Guía inicial en bruto" }, { term: "Capa de Entintado", definition: "Contorno limpio" }, { term: "Capa de Color", definition: "Rellenos bajo el entintado" } ] },
            { question: "¿Por qué usan capas los artistas digitales?", options: ["Para ir más lento", "Para colorear sin destruir el boceto", "Para bloquear el software", "Para desperdiciar espacio"] }
          ]
        },
        {
          title: "Módulo 2: Teoría del Color y Paletas",
          desc: "¡Elige colores que resalten!",
          contentSections: [
            { title: "Todo Se Ve Embarrado", content: "Rhea eligió doce colores que le gustaban para su dragón. Juntos se volvieron un lodo marrón. Su amiga usó tres y quedó mejor. Que te guste un color no significa que encaje ahí." },
            { title: "Los Opuestos Hacen Que Resalte", content: "En la rueda de color, las parejas opuestas son complementarias: azul y naranja, rojo y verde, amarillo y morado. Uno al lado del otro, cada uno hace que el otro se vea más vivo." },
            { title: "Por Qué Funcionan los Atardeceres", content: "Mira casi cualquier cartel de cine con un atardecer. Cielo naranja, sombras azules. Los carteles de superproducciones usan tanto esa pareja que tiene apodo: naranja y turquesa. Rhea pinta su dragón azul sobre un cielo naranja y de pronto destaca." },
            { title: "Tres Colores, No Doce", content: "Elige un color principal, su opuesto para el contraste y uno neutro. Con tres basta para un dibujo entero. Más colores no significan más interesante: casi siempre significan más embarrado." },
            { title: "Cambia el Fondo", content: "Coge cualquier dibujo tuyo. Rellena el fondo con el color opuesto a tu sujeto en la rueda. Luego prueba con el mismo color que el sujeto. Mira los dos y fíjate a cuál va tu ojo." },
            { title: "Resumen del Módulo 2", content: "• Los colores opuestos en la rueda son complementarios\n• Juntos hacen que cada uno se vea más vivo\n• Azul y naranja es la pareja más usada en el cine\n• Tres colores ganan a doce" }
          ],
          exercises: [
            { question: "Los colores opuestos en la rueda de color se llaman:", options: ["Análogos", "Complementarios", "Primarios", "Monocromáticos"] },
            { question: "El azul y el naranja son colores complementarios." },
            { question: "Los colores complementarios crean el máximo ___ visual.", answer: "contraste" },
            { question: "Relaciona los pares de colores complementarios:", pairs: [ { term: "Azul", definition: "Naranja" }, { term: "Rojo", definition: "Verde" }, { term: "Amarillo", definition: "Morado" } ] },
            { question: "¿Qué efecto crean los colores complementarios cuando se colocan uno al lado del otro?", options: ["Aburrimiento", "Máximo contraste y emoción", "Un borrón gris", "Invisibilidad"] }
          ]
        },
        {
          title: "Módulo 3: Composición y Regla de los Tercios",
          desc: "Organiza los elementos como un director profesional.",
          contentSections: [
            { title: "En el Centro y Aburrido", content: "Rhea puso el dragón justo en el centro del lienzo, como siempre. Parece una foto de pasaporte de un dragón. Correcta, simétrica y completamente quieta." },
            { title: "Divide el Lienzo en Nueve", content: "Traza dos líneas horizontales y dos verticales, como un tres en raya. Pon tu sujeto donde se cruzan en vez de en el centro. El dibujo deja de parecer congelado." },
            { title: "Tu Móvil Ya Lo Hace", content: "Abre la cámara del móvil y activa la cuadrícula en los ajustes. Salen las mismas nueve casillas. Los fotógrafos alinean el horizonte con la línea de abajo y las caras en un cruce. Rhea mueve su dragón al cruce superior izquierdo y le deja espacio para volar." },
            { title: "Más Antiguo Que las Cámaras", content: "La idea se escribió para pintores de paisajes en 1797, mucho antes de que existiera la fotografía. Pintores, fotógrafos, directores de cine y artistas de videojuegos la siguen usando." },
            { title: "Mueve Una Sola Cosa", content: "Coge un dibujo con el sujeto en el centro. Activa la cuadrícula de tu app y mueve el sujeto a un cruce. Deja espacio vacío hacia donde mira. Compara los dos." },
            { title: "Resumen del Módulo 3", content: "• Divide el lienzo en nueve casillas\n• Pon el sujeto en un cruce, no en el centro\n• Deja espacio hacia donde mira\n• Tu cámara tiene esa misma cuadrícula" }
          ],
          exercises: [
            { question: "¿Qué cuadrícula usa la Regla de los Tercios?", options: ["Cuadrícula 2x2", "Cuadrícula 3x3", "Cuadrícula 10x10", "Sin cuadrícula"] },
            { question: "Colocar un personaje justo en el centro es siempre la opción más cinematográfica." },
            { question: "En la Regla de los Tercios, coloca tu sujeto en las ___ de la cuadrícula.", answer: "intersecciones" },
            { question: "Relaciona los términos de composición:", pairs: [ { term: "Regla de los Tercios", definition: "Cuadrícula de alineación 3x3" }, { term: "Punto Focal", definition: "Lugar principal donde miran los ojos" }, { term: "Lienzo", definition: "Área de dibujo digital" } ] },
            { question: "¿Dónde debes colocar tu sujeto usando la Regla de los Tercios?", options: ["Siempre en el centro exacto", "Fuera del lienzo", "En las intersecciones de las líneas de la cuadrícula", "Solo en la esquina inferior izquierda"] }
          ]
        },
        {
          title: "Módulo 4: Renderizado e Iluminación",
          desc: "Haz que los dibujos planos parezcan 3D con luz y sombra.",
          contentSections: [
            { title: "El Dragón Plano", content: "El dragón de Rhea ya tiene color y composición y sigue pareciendo una pegatina. No pesa. Nada le dice a tu ojo si el cuerpo es redondo o plano, porque todo tiene el mismo brillo." },
            { title: "Decide Dónde Está la Luz", content: "Elige un punto del que venga la luz y mantenlo. Las superficies que miran hacia ella reciben brillo. Las que miran al lado contrario reciben sombra. Esa diferencia es lo que hace que una forma parezca sólida." },
            { title: "Luz Desde Arriba a la Izquierda", content: "Rhea pone la luz arriba a la izquierda:\n\nArriba a la izquierda de cada escama — lo más claro\nEn medio — el color base\nAbajo a la derecha — sombra\n\nAñade una sombra en el suelo bajo el dragón y deja de flotar. Con tres tonos y una sombra en el suelo ya se lee como sólido." },
            { title: "Entrecierra los Ojos", content: "Entrecierra los ojos hasta que el dibujo se vuelva borroso. Los colores desaparecen y solo quedan claros y oscuros. Si todo se funde en una papilla gris, tus sombras son demasiado suaves para leerse de lejos." },
            { title: "Una Bola, Tres Tonos", content: "Dibuja un círculo. Elige una dirección de luz. Rellénalo con un color base, añade una zona más clara hacia la luz y otra más oscura al lado opuesto. Añade una sombra en el suelo. Acabas de dibujar una esfera." },
            { title: "Resumen del Módulo 4", content: "• Elige una dirección de luz y mantenla\n• Hacia la luz es brillo, al lado contrario es sombra\n• Una sombra en el suelo evita que las cosas floten\n• Entrecierra los ojos para comprobar tus oscuros" }
          ],
          exercises: [
            { question: "¿Qué es el renderizado en el arte digital?", options: ["Añadir luz y sombra para dar profundidad 3D", "Borrar el boceto", "Añadir una firma", "Guardar como JPEG"] },
            { question: "El lado de un objeto que mira hacia el sol recibe una sombra." },
            { question: "El punto luminoso donde la luz incide directamente sobre un objeto se llama ___.", answer: "brillo" },
            { question: "Relaciona los términos de iluminación:", pairs: [ { term: "Fuente de Luz", definition: "De dónde viene la luz (sol/lámpara)" }, { term: "Brillo", definition: "El punto más luminoso del objeto" }, { term: "Sombra", definition: "Zona oscura alejada de la luz" } ] },
            { question: "¿Qué zona recibe un Brillo?", options: [ "El lado que da la espalda a la fuente de luz", "El lado que mira directamente hacia la luz", "La parte más cercana a la sombra del suelo", "El contorno dibujado alrededor de la figura" ] }
          ]
        }
      ]
    },
    "7": {
      title: "Computadora con Confianza: Domina la Máquina",
      desc: "Entiende la computadora que usas cada día: su sistema operativo, los atajos que te ahorran horas, cómo llega internet hasta ti y cómo escribir correos que sí se leen.",
      category: "Informática",
      difficulty: "Principiante",
      learningObjectives: [
        "Reconocer los principales sistemas operativos y qué hacen",
        "Usar los atajos que más tiempo ahorran",
        "Explicar cómo viaja una página desde un servidor hasta tu pantalla",
        "Escribir un correo que la gente sí lee"
      ],
      prerequisites: ["Una computadora o tablet que puedas usar"],
      modules: [
        {
          title: "Módulo 1: El Jefe de la Máquina",
          desc: "Qué es un sistema operativo y por qué el tuyo se ve así.",
          contentSections: [
            { title: "El Portátil Prestado de Zara", content: "Zara tomó prestado el portátil de su primo y nada estaba donde esperaba. Los botones estaban al otro lado. Cerrar una ventana no cerraba el programa. La misma clase de máquina, reglas completamente distintas." },
            { title: "El Sistema Operativo Manda en Todo", content: "Un sistema operativo es el programa que manda sobre los demás. Abre tus apps, recuerda tus archivos y dibuja todo lo que ves. Cada app tiene que pedirle permiso." },
            { title: "Los Que Vas a Encontrar", content: "Windows — la mayoría de portátiles y PCs\\nmacOS — computadoras de Apple\\nLinux — casi todos los servidores detrás de las webs\\nAndroid e iOS — teléfonos y tablets\\n\\nAndroid está construido sobre Linux e iOS comparte raíces con macOS: por eso un Mac y un iPhone se sienten parientes." },
            { title: "Ya Usas Varios", content: "Un teléfono, un portátil, una consola y una tele inteligente llevan cada uno su propio sistema operativo. Casi todo el mundo usa tres o cuatro al día sin nombrar ninguno." },
            { title: "Descubre Cuál Tienes", content: "En Windows pulsa la tecla Windows y escribe Acerca de. En un Mac abre el menú de la manzana y luego Acerca de este Mac. En el móvil entra en Ajustes y busca Acerca de. Anota el nombre y la versión." },
            { title: "Resumen del Módulo 1", content: "• El sistema operativo manda sobre todos los demás programas\\n• Windows, macOS y Linux llevan computadoras; Android e iOS, teléfonos\\n• Android se apoya en Linux; iOS es pariente de macOS\\n• Usas varios sistemas operativos cada día" }
          ],
          exercises: [
            { question: "¿De qué se encarga un sistema operativo?", options: ["Solo de guardar tus fotos a salvo", "De hacer funcionar todos los demás programas", "De conectar el aparato a internet", "De subir o bajar el brillo de la pantalla"] },
            { question: "Un teléfono lleva un sistema operativo, igual que un portátil." },
            { question: "Casi todos los servidores que alojan webs usan el sistema operativo ___.", answer: "Linux" },
            { question: "Relaciona cada sistema operativo con dónde se encuentra:", pairs: [ { term: "Windows", definition: "La mayoría de portátiles y PCs" }, { term: "macOS", definition: "Computadoras de Apple" }, { term: "Android", definition: "La mayoría de teléfonos y tablets" }, { term: "Linux", definition: "Servidores detrás de las webs" } ] },
            { question: "¿Por qué un Mac y un iPhone se sienten parecidos?", options: ["Se fabrican en la misma planta", "Sus sistemas operativos comparten las mismas raíces", "Los dos necesitan internet todo el tiempo", "Salieron a la venta el mismo año"] }
          ]
        },
        {
          title: "Módulo 2: Atajos Que Te Regalan Tiempo",
          desc: "Las pocas teclas que sustituyen cien viajes del ratón.",
          contentSections: [
            { title: "Cuarenta Minutos Arrastrando", content: "Zara movió cincuenta fotos a una carpeta de una en una, arrastrándolas. Su primo hizo las cincuenta siguientes en menos de un minuto. No trabajó más duro: se sabía tres teclas." },
            { title: "Un Atajo Es la Misma Orden, Más Rápida", content: "Los menús y los atajos hacen exactamente lo mismo. El menú es más fácil de encontrar; el atajo es más rápido cuando ya lo sabes. Aprender cinco vale más que aprender cincuenta." },
            { title: "Los Cinco Que Valen la Pena", content: "Ctrl+C copiar, Ctrl+V pegar\\nCtrl+Z deshacer, Ctrl+Y rehacer\\nCtrl+A seleccionar todo\\nCtrl+S guardar\\nCtrl+F buscar en esta página\\n\\nEn un Mac cambia Ctrl por Cmd. Ctrl+Z es la tecla más indulgente de cualquier teclado." },
            { title: "Deshacer Llega Más Atrás de lo Que Crees", content: "Deshacer no es un solo paso. Púlsalo otra vez y otra y casi todos los programas seguirán caminando hacia atrás. Borrar algo sin querer casi nunca es definitivo." },
            { title: "Compite Contigo Mismo", content: "Abre cualquier documento. Selecciona todo el texto y cópialo usando solo los menús, contando los segundos. Hazlo otra vez con Ctrl+A y Ctrl+C. Prueba Ctrl+F para buscar una palabra en esta página." },
            { title: "Resumen del Módulo 2", content: "• Un atajo y un menú ejecutan la misma orden\\n• Copiar, pegar, deshacer, seleccionar todo, guardar y buscar cubren casi todo\\n• Mac usa Cmd donde Windows usa Ctrl\\n• Deshacer sigue yendo atrás, así que los errores rara vez son definitivos" }
          ],
          exercises: [
            { question: "¿Qué hace Ctrl+Z?", options: ["Guarda el archivo en el que trabajas", "Deshace lo último que hiciste", "Cierra la ventana de inmediato", "Selecciona todo lo de la página"] },
            { question: "En un Mac normalmente pulsas Cmd donde Windows usa Ctrl." },
            { question: "El atajo para buscar una palabra en la página actual es Ctrl+___.", answer: "F" },
            { question: "Relaciona cada atajo con lo que hace:", pairs: [ { term: "Ctrl+C", definition: "Copiar" }, { term: "Ctrl+V", definition: "Pegar" }, { term: "Ctrl+A", definition: "Seleccionar todo" }, { term: "Ctrl+S", definition: "Guardar" } ] },
            { question: "Borras un párrafo sin querer. ¿Cuál es la solución más rápida?", options: ["Cerrar sin guardar y empezar de nuevo", "Pulsar Ctrl+Z para deshacerlo", "Volver a escribirlo de memoria", "Reiniciar la computadora entera"] }
          ]
        },
        {
          title: "Módulo 3: Cómo Llega una Página Hasta Ti",
          desc: "Qué pasa entre escribir una dirección y ver la página.",
          contentSections: [
            { title: "Los Deberes Que Desaparecieron", content: "La página de Zara no cargaba, así que culpó a la web. Su primo hizo una sola pregunta: ¿carga alguna otra cosa? Ninguna. La web estaba bien. Se le había caído el wifi." },
            { title: "Tu Navegador Pide, un Servidor Responde", content: "Escribir una dirección envía una petición por internet a una computadora que guarda la página. Esa computadora devuelve los archivos y tu navegador los dibuja. Cada página que abres es ese viaje de ida y vuelta." },
            { title: "Leer una Dirección Web", content: "https://www.ejemplo.com/fotos\\n\\nhttps — la conexión va cifrada\\nwww.ejemplo.com — a qué computadora preguntar\\n/fotos — qué página de ella\\n\\nEl candado significa que nadie por el camino puede leer lo que envías. No promete que el sitio sea honesto." },
            { title: "Averigua Dónde Falló", content: "Cuando una página no carga, prueba con otra web. Si fallan todas, es tu conexión. Si falla solo una, es esa web. Una pestaña más te lo dice antes de reiniciar nada." },
            { title: "Desarma una Dirección", content: "Mira la barra de direcciones ahora mismo. Encuentra el https, el nombre del sitio y la parte después de la barra. Abre otra web y compara las dos. Fíjate en qué parte cambia al navegar." },
            { title: "Resumen del Módulo 3", content: "• Tu navegador pide una página y un servidor la envía\\n• https significa que la conexión va cifrada\\n• La parte después de la barra elige la página\\n• Si fallan todas las webs, el problema es tu conexión" }
          ],
          exercises: [
            { question: "¿Qué ocurre cuando escribes una dirección web y pulsas enter?", options: ["Tu navegador pide la página a un servidor", "La página se construye en tu propia computadora", "Tu proveedor de internet elige un sitio por ti", "El navegador busca en los archivos de tu aparato"] },
            { question: "El candado significa que la conexión va cifrada, no que el sitio sea de fiar." },
            { question: "En https://ejemplo.com/fotos, la parte que elige qué página mostrar es ___.", answer: "/fotos" },
            { question: "Relaciona cada parte de una dirección web con su función:", pairs: [ { term: "https", definition: "La conexión va cifrada" }, { term: "ejemplo.com", definition: "A qué computadora preguntar" }, { term: "/fotos", definition: "Qué página de esa computadora" }, { term: "Navegador", definition: "Dibuja la página para ti" } ] },
            { question: "Una web no carga pero todas las demás funcionan. ¿Qué es lo más probable?", options: ["Tu wifi ha dejado de funcionar", "Algo va mal en esa web concreta", "Hay que reiniciar la computadora", "Hay que reinstalar el navegador hoy"] }
          ]
        },
        {
          title: "Módulo 4: Correos Que Sí Se Leen",
          desc: "Cómo funciona el correo y cómo escribir uno que reciba respuesta.",
          contentSections: [
            { title: "Sin Asunto, Sin Respuesta", content: "Zara escribió a su profesora con el asunto vacío y una palabra en el cuerpo: pregunta. Pasaron tres días sin respuesta. La profesora tenía más de doscientos correos sin leer y ningún motivo para abrir ese." },
            { title: "El Asunto Hace el Trabajo", content: "Casi todo el mundo decide si abre un correo solo por el asunto. Uno bueno dice de qué va y qué necesitas. Los asuntos vagos se saltan, no se rechazan." },
            { title: "El Mismo Correo, Dos Veces", content: "Asunto: pregunta\\nCuerpo: Tengo una pregunta\\n\\nAsunto: Trabajo de ciencias — ¿puedo entregarlo el viernes?\\nCuerpo: Hola profesora Díaz, estuve enferma el martes y me perdí los apuntes. ¿Podría entregar el informe el viernes? Gracias, Zara\\n\\nEl segundo se responde en cuatro segundos." },
            { title: "Mira la Dirección Antes Que las Palabras", content: "Un correo que parece oficial puede venir de cualquiera. Lee la dirección real, no el nombre que se muestra. Cualquier cosa que pida una contraseña o un código merece enseñársela a un adulto antes de responder." },
            { title: "Reescribe un Asunto Flojo", content: "Escribe un asunto para: pedir entrar en el equipo de fútbol, preguntar por una sudadera perdida, dar las gracias por una ayuda. Cada uno debe decir el tema y qué quieres en menos de diez palabras." },
            { title: "Resumen del Módulo 4", content: "• La gente decide por el asunto si lo abre\\n• Di el tema y qué necesitas\\n• Cc copia a alguien; todos ven a quién\\n• Lee la dirección real y nunca envíes una contraseña" }
          ],
          exercises: [
            { question: "¿Por qué importa tanto un asunto claro?", options: ["Hace que el correo llegue más rápido", "La gente decide por él si lo abre", "El correo no se envía sin asunto", "Evita que el mensaje acabe en spam"] },
            { question: "Todos los que están en Para y en Cc pueden ver quién más recibió el correo." },
            { question: "Para copiar a alguien en un correo sin que sea el destinatario principal, ponlo en ___.", answer: "Cc" },
            { question: "Relaciona cada campo del correo con su función:", pairs: [ { term: "Para", definition: "A quién va dirigido" }, { term: "Cc", definition: "Alguien a quien se mantiene al tanto" }, { term: "Asunto", definition: "De qué trata" }, { term: "Adjunto", definition: "Un archivo enviado con él" } ] },
            { question: "Un correo dice que tu cuenta se cerrará si no envías tu contraseña. ¿Qué haces?", options: ["Responder rápido para no perder nada", "Enseñárselo a un adulto y no enviar nada", "Enviarla solo si el logo parece correcto", "Reenviarlo a todos como aviso"] }
          ]
        }
      ]
    },
    "8": {
      title: "Científico de la Comida: Qué Hace tu Cuerpo con Ella",
      desc: "Descubre qué es de verdad una caloría, qué hacen dentro de ti los carbohidratos, las proteínas y las grasas, y por qué un futbolista y un bebé necesitan cantidades completamente distintas.",
      category: "Salud",
      difficulty: "Principiante",
      learningObjectives: [
        "Explicar qué mide una caloría",
        "Describir qué hacen los carbohidratos, las proteínas y las grasas",
        "Decir por qué las vitaminas y los minerales importan en cantidades diminutas",
        "Explicar por qué cada persona necesita cantidades distintas de comida"
      ],
      prerequisites: ["Curiosidad por lo que hay en tu plato"],
      modules: [
        {
          title: "Módulo 1: Qué Es de Verdad una Caloría",
          desc: "Una unidad de energía, no un marcador que ganas o pierdes.",
          contentSections: [
            { title: "Theo Lee la Caja", content: "Theo le dio la vuelta a la caja de cereales y encontró un número: 380 calorías. Había oído decir que las calorías eran malas. Pero los cereales no son malos. Quería saber qué significaba ese número." },
            { title: "Una Caloría Mide Energía", content: "Una caloría es una unidad, como un centímetro o un litro. Mide cuánta energía puede darle un alimento a tu cuerpo. Más calorías es más energía, igual que un depósito más grande lleva más combustible." },
            { title: "En Qué la Gasta tu Cuerpo", content: "Correr y jugar al fútbol: la parte en la que todos piensan\\nRespirar, bombear sangre, mantenerte caliente\\nCrecer y formar músculo\\nPensar, todo el día, en clase\\n\\nCasi toda la energía que usas se va en seguir vivo y crecer, no en hacer deporte." },
            { title: "Tu Cerebro Tiene Hambre", content: "Tu cerebro es alrededor del dos por ciento de tu peso pero usa cerca del veinte por ciento de tu energía. Estar quieto concentrándote cuesta combustible de verdad." },
            { title: "Busca el Número", content: "Encuentra tres paquetes en tu cocina. Anota las calorías por cada 100 gramos. Ordénalos y pregúntate cuál te sorprendió y por qué." },
            { title: "Resumen del Módulo 1", content: "• Una caloría es una unidad de energía, como el centímetro lo es de longitud\\n• No es una nota buena ni mala\\n• Casi toda tu energía se va en vivir y crecer\\n• Solo tu cerebro usa cerca de una quinta parte" }
          ],
          exercises: [
            { question: "¿Qué mide una caloría?", options: ["Cuánto azúcar lleva un alimento", "Cuánta energía puede darte un alimento", "Cuánto pesa una ración de comida", "Cuánto tarda un alimento en digerirse"] },
            { question: "Casi toda la energía que usas cada día se va en hacer deporte." },
            { question: "Una caloría es una unidad de ___.", answer: "energía" },
            { question: "Relaciona cada tarea con para qué necesita energía:", pairs: [ { term: "Respirar", definition: "Mantener tu cuerpo en marcha" }, { term: "Crecer", definition: "Formar hueso y músculo nuevos" }, { term: "Pensar", definition: "Alimentar tu cerebro" }, { term: "Correr", definition: "Mover los músculos con fuerza" } ] },
            { question: "¿Más o menos cuánta energía usa tu cerebro?", options: ["Alrededor del dos por ciento", "Alrededor del veinte por ciento", "Más o menos la mitad", "Casi nada" ] }
          ]
        },
        {
          title: "Módulo 2: Los Tres Grandes",
          desc: "Carbohidratos, proteínas y grasas, y para qué sirve cada uno.",
          contentSections: [
            { title: "La Tarde Floja de Theo", content: "Theo desayunó tostada con mermelada y se sintió genial, y se quedó sin fuerzas en la segunda clase. Su amigo tomó huevos con tostada y seguía entero. La misma cantidad de comida, tardes muy distintas." },
            { title: "Tres Clases de Combustible", content: "Los macronutrientes son las tres cosas que tu cuerpo necesita en gran cantidad. El carbohidrato es energía rápida, la proteína es material de construcción, la grasa es energía duradera y protección. Macro solo significa grande." },
            { title: "Qué Hace Cada Uno", content: "Carbohidratos — pan, arroz, fruta. Energía rápida para ahora.\\nProteínas — huevos, legumbres, pescado, lentejas. Construye y repara músculo.\\nGrasas — frutos secos, aceite de oliva, queso. Energía lenta, protege tus órganos, ayuda a tu cerebro.\\n\\nUna comida con los tres te aguanta mucho más que una de solo carbohidratos." },
            { title: "Ningún Macro Es el Malo", content: "La gente se turna para culpar a la grasa, luego a los carbohidratos, luego a otra cosa. Tu cuerpo necesita los tres. Un cuerpo sin grasa o sin carbohidratos no funciona mejor: funciona peor." },
            { title: "Clasifica tu Comida", content: "Piensa en lo último que comiste. Escribe cada parte bajo carbohidrato, proteína o grasa. Algunos alimentos caen en dos columnas. Fíjate si alguna columna quedó vacía." },
            { title: "Resumen del Módulo 2", content: "• Macro significa grande: los tres que más necesitas\\n• El carbohidrato es energía rápida\\n• La proteína te construye y repara\\n• La grasa es energía lenta y protección\\n• Necesitas los tres, no dos de ellos" }
          ],
          exercises: [
            { question: "¿Qué macronutriente se usa sobre todo para construir y reparar músculo?", options: ["Carbohidrato", "Proteína", "Grasa", "Agua"] },
            { question: "Un cuerpo sano necesita carbohidratos, proteínas y grasas, no solo dos de ellos." },
            { question: "La palabra macro en macronutriente significa ___.", answer: "grande" },
            { question: "Relaciona cada macronutriente con su función principal:", pairs: [ { term: "Carbohidrato", definition: "Energía rápida" }, { term: "Proteína", definition: "Construir y reparar" }, { term: "Grasa", definition: "Energía lenta y protección" }, { term: "Los tres", definition: "Una comida que aguanta" } ] },
            { question: "¿Por qué Theo se quedó sin energía antes que su amigo?", options: ["Comió muchísimo menos de la cuenta", "Su desayuno era casi todo carbohidrato", "Tomó demasiada proteína de golpe", "No bebió agua con el desayuno"] }
          ]
        },
        {
          title: "Módulo 3: Cantidades Diminutas, Tareas Enormes",
          desc: "Vitaminas y minerales, y por qué la cantidad no mide la importancia.",
          contentSections: [
            { title: "Los Marineros Que Comían Limas", content: "Los viajes largos por mar dejaban a los marineros agotados y con las encías sangrando. Tenían comida de sobra y energía de sobra. Lo que les faltaba no pesaba casi nada: vitamina C. Las limas lo arreglaron." },
            { title: "Los Micronutrientes Son Herramientas, No Combustible", content: "Las vitaminas y los minerales no te dan energía alguna. Tu cuerpo los usa para hacer tareas: formar hueso, transportar oxígeno, curar heridas. Micro significa pequeño, y solo necesitas cantidades diminutas." },
            { title: "Algunos y Qué Hacen", content: "Hierro — transporta oxígeno en tu sangre\\nCalcio — forma huesos y dientes\\nVitamina C — cura heridas y ayuda a absorber hierro\\nVitamina D — deja que tu cuerpo use el calcio\\n\\nLa vitamina C ayuda a absorber hierro, así que las legumbres con tomate ganan a las legumbres solas." },
            { title: "Una la Fabrica el Sol", content: "La vitamina D es la rara: tu piel la fabrica con la luz del sol. Es la única vitamina que tu cuerpo puede producir solo, por eso baja en los inviernos largos y oscuros." },
            { title: "Cuenta Colores", content: "Cuenta cuántos colores distintos de fruta y verdura comiste ayer. Colores distintos suelen significar micronutrientes distintos. Propón añadir un color nuevo mañana." },
            { title: "Resumen del Módulo 3", content: "• Los micronutrientes no dan energía; permiten hacer tareas\\n• El hierro transporta oxígeno, el calcio forma hueso\\n• La vitamina C ayuda a absorber hierro\\n• Tu piel fabrica vitamina D con el sol" }
          ],
          exercises: [
            { question: "¿Qué le dan a tu cuerpo las vitaminas y los minerales?", options: ["Energía para correr y jugar", "Herramientas para tareas como formar hueso", "Peso extra para crecer más", "Agua para mantenerte hidratado"] },
            { question: "La vitamina D es la única vitamina que tu propia piel puede fabricar, usando el sol." },
            { question: "El mineral que transporta oxígeno por tu sangre es el ___.", answer: "hierro" },
            { question: "Relaciona cada micronutriente con su tarea:", pairs: [ { term: "Hierro", definition: "Transporta oxígeno en tu sangre" }, { term: "Calcio", definition: "Forma huesos y dientes" }, { term: "Vitamina C", definition: "Cura heridas y ayuda a absorber hierro" }, { term: "Vitamina D", definition: "Deja que tu cuerpo use el calcio" } ] },
            { question: "¿Por qué aparece micro en la palabra micronutriente?", options: ["Solo se encuentran en alimentos pequeños", "Los necesitas en cantidades diminutas", "Se descubrieron los últimos", "Son los menos importantes"] }
          ]
        },
        {
          title: "Módulo 4: Por Qué Nadie Necesita lo Mismo",
          desc: "La edad, el tamaño y cómo pasas el día cambian la respuesta.",
          contentSections: [
            { title: "Tres Platos en una Mesa", content: "La familia de Theo se sentó junta: su hermana bebé, su tío que corre maratones y su abuela. Tres platos muy distintos, y cada uno era el correcto para quien se lo comía." },
            { title: "Tu Cuerpo Marca la Cantidad", content: "Cuánta energía necesita alguien depende de su tamaño, su edad y de cómo pasa el día. Un cuerpo más grande cuesta más de mantener. Un cuerpo que crece, todavía más." },
            { title: "Misma Familia, Necesidades Distintas", content: "Un maratoniano pasa horas moviéndose, así que necesita mucha.\\nUn bebé es pequeño pero crece deprisa, así que necesita bastante para su tamaño.\\nUna persona mayor que se mueve menos necesita menos.\\n\\nNinguna es mejor que otra. Son respuestas a preguntas distintas." },
            { title: "No Hay un Número Correcto para un Niño", content: "Los cuerpos que crecen necesitan mucho, y el apetito cambia de una semana a otra, y eso es normal. Nadie de tu edad debería contar ni limitar. Si alguna vez te preguntas por tu propia alimentación, eso lo responde un médico, no internet." },
            { title: "Adivina Quién Necesita Más", content: "Para cada pareja, di quién necesita seguramente más energía al día y por qué: alguien que nada a diario o alguien en reposo con una pierna rota; un adolescente en pleno estirón o un adulto más pequeño. Di tu razón en voz alta." },
            { title: "Resumen del Módulo 4", content: "• El tamaño, la edad y la actividad cambian la energía que alguien necesita\\n• Los cuerpos que crecen necesitan mucho para su tamaño\\n• Necesidades distintas no son mejores ni peores\\n• No hay un número correcto para un niño: eso lo responde un médico" }
          ],
          exercises: [
            { question: "¿Qué cambia la energía que una persona necesita al día?", options: ["Solo cuánto pesa", "Su tamaño, su edad y lo activa que es", "Solo los deportes que practica", "La época del año en que estemos"] },
            { question: "Un bebé necesita bastante energía para su tamaño, porque crece deprisa." },
            { question: "Si tienes una duda sobre tu propia alimentación, la persona a la que preguntar es un ___.", answer: "médico" },
            { question: "Relaciona cada persona con por qué cambian sus necesidades:", pairs: [ { term: "Maratoniano", definition: "Horas de movimiento intenso" }, { term: "Bebé", definition: "Pequeño, pero crece deprisa" }, { term: "Persona mayor", definition: "Normalmente se mueve menos" }, { term: "Adolescente", definition: "Crece deprisa y es activo" } ] },
            { question: "Dos personas comen cantidades muy distintas. ¿Qué te dice eso?", options: ["Una de las dos come mal", "Sus cuerpos necesitan cantidades distintas", "El plato más grande siempre es mejor", "Deberían intercambiarse las comidas"] }
          ]
        }
      ]
    },
    "9": {
      title: "La IA Explicada: Cómo Aprende y Dónde Falla",
      desc: "Entiende cómo la IA aprende de ejemplos, por qué suena segura aunque se equivoque, cómo recoge injusticias y cómo usarla sin entregarle tu forma de pensar.",
      category: "Alfabetización en IA",
      difficulty: "Principiante",
      learningObjectives: [
        "Explicar cómo una máquina aprende a partir de ejemplos",
        "Decir por qué la IA puede equivocarse con total seguridad",
        "Reconocer por dónde se cuela la injusticia en un sistema",
        "Usar la IA como ayudante sin que piense por ti"
      ],
      prerequisites: ["No hace falta experiencia"],
      modules: [
        {
          title: "Módulo 1: Aprender con Ejemplos",
          desc: "Cómo pasaron las máquinas de reglas fijas a detectar patrones.",
          contentSections: [
            { title: "Nia Intenta Escribir las Reglas", content: "Nia intentó escribir instrucciones para distinguir un gato de un perro. Cuatro patas, pelo, bigotes, cola. Todas las reglas que escribía valían para los dos. Al cabo de una hora no tenía ninguna que funcionara." },
            { title: "Enséñaselo, No Se lo Cuentes", content: "Los programas antiguos seguían reglas escritas por una persona. La IA moderna ve en cambio miles de ejemplos y deduce el patrón ella sola. Nadie le explica qué es un bigote." },
            { title: "Tres Épocas, la Misma Pregunta", content: "Reglas — una persona escribe: si ladra, es un perro. Falla con un perro callado.\\nAprendizaje — le enseñas muchas fotos etiquetadas. Encuentra el patrón.\\nGeneración — con suficientes ejemplos, también puede crear texto o imágenes nuevas.\\n\\nCada paso necesitó más ejemplos y más potencia, no una regla más lista." },
            { title: "Nunca Ha Visto un Gato", content: "Un modelo de imágenes no tiene ni idea de cómo se siente el pelo ni de que los gatos ronronean. Solo ha visto números que describen píxeles. Reconoce el patrón sin entender al animal." },
            { title: "Prueba a Escribir las Reglas", content: "Escribe instrucciones para distinguir una taza de un cuenco, tan precisas que sirvan a alguien que nunca ha visto ninguno. Pruébalas con cinco objetos reales. Cuenta cuántas fallan." },
            { title: "Resumen del Módulo 1", content: "• Los programas antiguos seguían reglas escritas por personas\\n• La IA moderna aprende el patrón de muchos ejemplos\\n• Más ejemplos y potencia, no reglas más listas\\n• Reconocer un patrón no es entenderlo" }
          ],
          exercises: [
            { question: "¿Cómo aprende sobre todo la IA moderna a distinguir cosas?", options: ["Una persona escribe reglas para cada caso", "Encuentra patrones en muchos ejemplos", "Busca la respuesta en internet", "Le pregunta a un humano cada vez"] },
            { question: "Un modelo de imágenes entiende qué es un gato igual que lo entiende una persona." },
            { question: "En vez de darle reglas, a la IA moderna se le dan muchos ___ para aprender.", answer: "ejemplos" },
            { question: "Relaciona cada enfoque con lo que hace:", pairs: [ { term: "Reglas", definition: "Una persona escribe cada instrucción" }, { term: "Aprendizaje", definition: "Encuentra patrones en ejemplos" }, { term: "Generación", definition: "Crea texto o imágenes nuevas" }, { term: "Ejemplos", definition: "Aquello de lo que aprende" } ] },
            { question: "¿Por qué fallaban siempre las reglas de Nia?", options: ["No escribió suficientes", "Casi todas valían para los dos animales", "Su computadora era muy lenta", "Gatos y perros son idénticos"] }
          ]
        },
        {
          title: "Módulo 2: Segura y Equivocada",
          desc: "Por qué la IA se inventa cosas y nunca suena dudosa.",
          contentSections: [
            { title: "El Libro Que No Existía", content: "Nia pidió a una IA libros sobre volcanes. Le dio cinco títulos con autores y años. Su bibliotecaria encontró cuatro. El quinto no existía ni había existido nunca, pero parecía tan real como los demás." },
            { title: "Predice, No Consulta", content: "Un modelo de lenguaje adivina qué palabras suelen venir después. No está buscando en una biblioteca. Un título inventado encaja perfectamente con el patrón de los títulos reales, así que sale igual de convincente." },
            { title: "Dónde Es Más Débil", content: "Números y fechas exactas\\nQuién dijo o escribió qué\\nCualquier cosa muy reciente\\nEnlaces y referencias\\n\\nSon los detalles que un patrón no puede aportar. Produce algo con la forma correcta, no algo comprobado." },
            { title: "La Seguridad No Es una Prueba", content: "La IA escribe una respuesta equivocada con la misma voz tranquila y ordenada que una correcta. No hay ningún titubeo que te avise. Todo lo que importe se comprueba en otro sitio, siempre." },
            { title: "Píllala en un Fallo", content: "Pregúntale a una IA por algo que conozcas bien: un lugar de tu zona, tu deporte favorito, una afición familiar. Busca el detalle que falla un poco. Fíjate en lo segura que suena mientras lo dice." },
            { title: "Resumen del Módulo 2", content: "• Un modelo de lenguaje predice palabras probables, no consulta\\n• Los datos inventados parecen exactamente reales\\n• Números, fechas, fuentes y lo reciente son lo más débil\\n• Sonar segura no es lo mismo que acertar" }
          ],
          exercises: [
            { question: "¿Por qué puede una IA inventarse un libro que no existe?", options: ["Su biblioteca está desactualizada", "Predice palabras probables en vez de consultar", "Alguien borró el registro real", "Intenta engañarte a propósito"] },
            { question: "La IA suele sonar menos segura cuando su respuesta es incorrecta." },
            { question: "Un modelo de lenguaje funciona prediciendo qué ___ vienen después.", answer: "palabras" },
            { question: "Relaciona cada cosa con cuánta comprobación necesita:", pairs: [ { term: "Una fecha exacta", definition: "Compruébala en otro sitio" }, { term: "Una fuente o enlace", definition: "Compruébala en otro sitio" }, { term: "Explicar una idea", definition: "Terreno normalmente más seguro" }, { term: "Noticias muy recientes", definition: "Compruébalas en otro sitio" } ] },
            { question: "Una IA te da un dato para tus deberes. ¿Cuál es el paso sensato?", options: ["Usarlo, sonaba seguro", "Comprobarlo en otra fuente", "Preguntarle lo mismo otra vez", "Usarlo solo si es corto"] }
          ]
        },
        {
          title: "Módulo 3: Por Dónde Se Cuela la Injusticia",
          desc: "Un sistema aprende lo que contienen los ejemplos, incluida la parte injusta.",
          contentSections: [
            { title: "El Dibujo Que Salía Siempre Igual", content: "Nia pidió a una IA que dibujara a un científico diez veces. En todas salió un hombre mayor con bata blanca. Su profesora de ciencias es una mujer joven. La máquina no estaba siendo cruel: repetía lo que le habían enseñado." },
            { title: "Los Ejemplos Llevan el Sesgo", content: "Un modelo solo puede aprender de lo que le dan. Si los ejemplos muestran demasiado a un solo tipo de persona, el resultado también. La injusticia entró con los datos, no de una opinión." },
            { title: "Dónde Se Nota", content: "Imágenes que siempre muestran al mismo tipo de persona en un oficio\\nHerramientas de voz que se atascan con ciertos acentos\\nTraducciones que adivinan un género que nunca se dijo\\n\\nCada una es un patrón de los ejemplos, devuelto mucho más rápido y a mucha mayor escala." },
            { title: "Pregunta Quién Falta", content: "Cuando la IA describe a un grupo de personas, pregunta quién no está en la foto. El hueco suele ser un hueco en los ejemplos, y se ve mucho mejor desde fuera que desde dentro." },
            { title: "Haz la Prueba Tú", content: "Pide a una herramienta de imágenes un enfermero, un cocinero y un piloto varias veces cada uno. Haz recuento. Compáralo con quienes hacen esos trabajos donde vives de verdad." },
            { title: "Resumen del Módulo 3", content: "• Un modelo aprende solo de los ejemplos que recibe\\n• Ejemplos injustos dan resultados injustos\\n• Repite patrones, no tiene opiniones\\n• Preguntar quién falta es la comprobación más rápida" }
          ],
          exercises: [
            { question: "¿Por qué una IA puede dibujar siempre al mismo tipo de persona para un oficio?", options: ["Ha decidido quién encaja ahí", "Sus ejemplos mostraban sobre todo a esa persona", "Está copiando a otra IA", "Dibujar a otras personas es más difícil"] },
            { question: "El sesgo en la IA suele venir de los ejemplos con los que aprendió." },
            { question: "Cuando la IA muestra a un grupo de personas, una buena pregunta es quién ___.", answer: "falta" },
            { question: "Relaciona cada ejemplo con el hueco que hay detrás:", pairs: [ { term: "Siempre el mismo científico", definition: "Ejemplos de imagen poco variados" }, { term: "Se atasca con un acento", definition: "Ejemplos de voz poco variados" }, { term: "Adivina un género", definition: "Patrones en textos antiguos" }, { term: "Quién falta", definition: "La pregunta que lo detecta" } ] },
            { question: "¿Qué hace que esta injusticia sea mayor problema que la opinión de una persona?", options: ["Las máquinas no se pueden corregir", "Se repite a enorme velocidad y escala", "Solo afecta a las imágenes", "Nadie puede llegar a notarla"] }
          ]
        },
        {
          title: "Módulo 4: Usarla Sin Dejarle tu Cabeza",
          desc: "Dónde ayuda de verdad la IA y dónde usarla te cuesta el aprendizaje.",
          contentSections: [
            { title: "Dos Formas de Entregar un Trabajo", content: "Nia le pidió a una IA que escribiera su trabajo y lo entregó. Su amigo le pidió que le explicara la parte confusa y luego escribió el suyo. Los dos entregaron. Solo uno supo responder una pregunta sobre él después." },
            { title: "Una Ayudante, No un Sustituto", content: "La IA es buena explicando algo de otra manera, sugiriendo un punto de partida o revisando la ortografía. Es mala sustituyendo el pensamiento, porque pensar es justo la parte que te cambia." },
            { title: "Buena Pregunta, Mala Pregunta", content: "Mala: escríbeme el trabajo sobre volcanes\\nBuena: explícame por qué sube el magma, como si tuviera doce años\\n\\nMala: resuélveme este problema de mates\\nBuena: me da 42 y la solución es 36, ¿dónde me equivoqué?\\n\\nLas buenas te dejan el trabajo a ti y usan la IA para la parte atascada." },
            { title: "Nunca le Des Cosas Privadas", content: "Tu nombre completo, tu dirección, tu colegio, tus contraseñas y fotos de otras personas no van en un chat. Trata lo que escribes como algo que leerías en voz alta sin problema." },
            { title: "Convierte una Mala Pregunta en Buena", content: "Coge algo que te costara esta semana. Escribe la versión perezosa de la pregunta y luego reescríbela para que la IA explique y el trabajo siga siendo tuyo. Fíjate cuál te enseña más." },
            { title: "Resumen del Módulo 4", content: "• La IA explica y sugiere bien; piensa por ti mal\\n• Pídele que explique, no que sustituya el trabajo\\n• El esfuerzo es la parte que te enseña\\n• Los datos privados no entran en un chat" }
          ],
          exercises: [
            { question: "¿Cuál es la mejor forma de usar la IA para los deberes?", options: ["Pedirle que escriba toda la respuesta", "Pedirle que explique la parte confusa", "Copiarla y cambiar algunas palabras", "Usarla solo cuando estés cansado"] },
            { question: "Tu dirección, tu colegio y tus contraseñas nunca deberían escribirse en un chat de IA." },
            { question: "La IA es una buena ___, pero un mal sustituto de tu propio pensamiento.", answer: "ayudante" },
            { question: "Relaciona cada uso con si te ayuda a aprender:", pairs: [ { term: "Explícamelo otra vez", definition: "Te ayuda a aprender" }, { term: "Escríbelo por mí", definition: "Te salta el aprendizaje" }, { term: "Dónde me equivoqué", definition: "Te ayuda a aprender" }, { term: "Dame la respuesta", definition: "Te salta el aprendizaje" } ] },
            { question: "¿Por qué el amigo de Nia supo responder sobre su trabajo y ella no?", options: ["Escribe mejor por naturaleza", "Hizo el trabajo de pensar él mismo", "Su trabajo era más largo", "Eligió un tema más fácil"] }
          ]
        }
      ]
    }
  },
};

export default content;
