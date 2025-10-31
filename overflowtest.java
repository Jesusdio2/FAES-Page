public class Overflowtest {
    public static void main(String[] args) {
        int x = Integer.MAX_VALUE; // 2_147_483_647

        // Esto lanza ArithmeticException si hay desbordamiento
        int y = Math.addExact(x, 1);

        System.out.println("Resultado: " + y);
    }
}
