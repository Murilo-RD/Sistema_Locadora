package com.example.Locadora.exception;

public class DataInvalidaException extends RuntimeException {

    public DataInvalidaException(String mensagem) {
        super(mensagem);
    }

    public DataInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}