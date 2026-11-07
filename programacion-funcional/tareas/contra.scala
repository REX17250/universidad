@main def llamado (contra:String): Either[String, String] =
    if (contra.exists(_.isDigit) && contra.length>=8) Right(contra)
    else Left("...")
    